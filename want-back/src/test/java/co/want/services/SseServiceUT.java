package co.want.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.mockito.ArgumentCaptor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.lang.reflect.Field;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SseServiceUT {

    private SseService sseService;
    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;

    @BeforeEach
    void setUp() {
        sseService = new SseService();
        System.setOut(new PrintStream(outContent));
    }

    @AfterEach
    void tearDown() {
        System.setOut(originalOut);
    }

    @Test
    @DisplayName("Should create SseEmitter with unlimited timeout when subscribing")
    void testSubscribe_CreatesEmitterWithUnlimitedTimeout() {
        // Arrange
        Long userId = 1L;

        // Act
        SseEmitter emitter = sseService.subscribe(userId);

        // Assert
        assertNotNull(emitter);
        assertEquals(0L, emitter.getTimeout());
    }

    @Test
    @DisplayName("Should add emitter to map when subscribing")
    void testSubscribe_AddsEmitterToMap() throws Exception {
        // Arrange
        Long userId = 1L;

        // Act
        SseEmitter emitter = sseService.subscribe(userId);

        // Assert
        Map<String, SseEmitter> emitters = getEmittersMap();
        assertTrue(emitters.containsKey("1"));
        assertEquals(emitter, emitters.get("1"));
    }

    @Test
    @DisplayName("Should print subscription message when subscribing")
    void testSubscribe_PrintsSubscriptionMessage() {
        // Arrange
        Long userId = 1L;

        // Act
        sseService.subscribe(userId);

        // Assert
        String output = outContent.toString();
        assertTrue(output.contains("1subscribed"));
    }

    @Test
    @DisplayName("Should handle multiple subscriptions")
    void testSubscribe_MultipleUsers() throws Exception {
        // Arrange
        Long userId1 = 1L;
        Long userId2 = 2L;
        Long userId3 = 3L;

        // Act
        SseEmitter emitter1 = sseService.subscribe(userId1);
        SseEmitter emitter2 = sseService.subscribe(userId2);
        SseEmitter emitter3 = sseService.subscribe(userId3);

        // Assert
        Map<String, SseEmitter> emitters = getEmittersMap();
        assertEquals(3, emitters.size());
        assertTrue(emitters.containsKey("1"));
        assertTrue(emitters.containsKey("2"));
        assertTrue(emitters.containsKey("3"));
    }

    @Test
    @DisplayName("Should replace existing emitter when same user subscribes again")
    void testSubscribe_ReplaceExistingEmitter() throws Exception {
        // Arrange
        Long userId = 1L;

        // Act
        SseEmitter firstEmitter = sseService.subscribe(userId);
        SseEmitter secondEmitter = sseService.subscribe(userId);

        // Assert
        Map<String, SseEmitter> emitters = getEmittersMap();
        assertEquals(1, emitters.size());
        assertEquals(secondEmitter, emitters.get("1"));
        assertNotEquals(firstEmitter, secondEmitter);
    }

    @Test
    @DisplayName("Should send notification successfully to subscribed user")
    void testSendNotification_Success() throws Exception {
        // Arrange
        Long authorId = 1L;
        Long likerId = 2L;
        SseEmitter mockEmitter = mock(SseEmitter.class);
        
        // Subscribe and replace with mock
        sseService.subscribe(authorId);
        Map<String, SseEmitter> emitters = getEmittersMap();
        emitters.put("1", mockEmitter);

        // Act
        sseService.sendNotification(authorId, likerId);

        // Assert
        ArgumentCaptor<SseEmitter.SseEventBuilder> captor = ArgumentCaptor.forClass(SseEmitter.SseEventBuilder.class);
        verify(mockEmitter).send(captor.capture());
        
        String output = outContent.toString();
        assertTrue(output.contains("\"author\":1"));
        assertTrue(output.contains("\"liker\":2"));
    }

    @Test
    @DisplayName("Should not throw exception when sending to non-existent user")
    void testSendNotification_UserNotSubscribed() {
        // Arrange
        Long authorId = 999L;
        Long likerId = 2L;

        // Act & Assert
        assertDoesNotThrow(() -> sseService.sendNotification(authorId, likerId));
    }

    @Test
    @DisplayName("Should remove emitter when IOException occurs during send")
    void testSendNotification_RemovesEmitterOnIOException() throws Exception {
        // Arrange
        Long authorId = 1L;
        Long likerId = 2L;
        SseEmitter mockEmitter = mock(SseEmitter.class);
        
        // Subscribe and replace with mock
        sseService.subscribe(authorId);
        Map<String, SseEmitter> emitters = getEmittersMap();
        emitters.put("1", mockEmitter);

        // Configure mock to throw IOException
        doThrow(new IOException("Connection error")).when(mockEmitter).send(any(SseEmitter.SseEventBuilder.class));

        // Act
        sseService.sendNotification(authorId, likerId);

        // Assert
        assertFalse(emitters.containsKey("1"));
    }

    @Test
    @DisplayName("Should send correct JSON format")
    void testSendNotification_CorrectJsonFormat() {
        // Arrange
        Long authorId = 100L;
        Long likerId = 200L;
        sseService.subscribe(authorId);

        // Act
        sseService.sendNotification(authorId, likerId);

        // Assert
        String output = outContent.toString();
        assertTrue(output.contains("{\"author\":100,\"liker\":200}") || 
                   output.contains("{\"liker\":200,\"author\":100}"));
    }

    @Test
    @DisplayName("Should handle multiple notifications to same user")
    void testSendNotification_MultipleNotifications() throws Exception {
        // Arrange
        Long authorId = 1L;
        SseEmitter mockEmitter = mock(SseEmitter.class);
        
        sseService.subscribe(authorId);
        Map<String, SseEmitter> emitters = getEmittersMap();
        emitters.put("1", mockEmitter);

        // Act
        sseService.sendNotification(authorId, 2L);
        sseService.sendNotification(authorId, 3L);
        sseService.sendNotification(authorId, 4L);

        // Assert
        verify(mockEmitter, times(3)).send(any(SseEmitter.SseEventBuilder.class));
    }

    @Test
    @DisplayName("Should handle notifications to different users")
    void testSendNotification_DifferentUsers() throws Exception {
        // Arrange
        SseEmitter mockEmitter1 = mock(SseEmitter.class);
        SseEmitter mockEmitter2 = mock(SseEmitter.class);
        
        sseService.subscribe(1L);
        sseService.subscribe(2L);
        
        Map<String, SseEmitter> emitters = getEmittersMap();
        emitters.put("1", mockEmitter1);
        emitters.put("2", mockEmitter2);

        // Act
        sseService.sendNotification(1L, 10L);
        sseService.sendNotification(2L, 20L);

        // Assert
        verify(mockEmitter1, times(1)).send(any(SseEmitter.SseEventBuilder.class));
        verify(mockEmitter2, times(1)).send(any(SseEmitter.SseEventBuilder.class));
    }

    @Test
    @DisplayName("Should handle null userId gracefully")
    void testSubscribe_NullUserId() {
        // Act & Assert
        assertDoesNotThrow(() -> {
            SseEmitter emitter = sseService.subscribe(null);
            assertNotNull(emitter);
        });
    }

    @Test
    @DisplayName("Should handle zero userId")
    void testSubscribe_ZeroUserId() throws Exception {
        // Arrange
        Long userId = 0L;

        // Act
        SseEmitter emitter = sseService.subscribe(userId);

        // Assert
        Map<String, SseEmitter> emitters = getEmittersMap();
        assertTrue(emitters.containsKey("0"));
    }

    @Test
    @DisplayName("Should handle negative userId")
    void testSubscribe_NegativeUserId() throws Exception {
        // Arrange
        Long userId = -1L;

        // Act
        SseEmitter emitter = sseService.subscribe(userId);

        // Assert
        Map<String, SseEmitter> emitters = getEmittersMap();
        assertTrue(emitters.containsKey("-1"));
    }

    @Test
    @DisplayName("Should handle large userId values")
    void testSubscribe_LargeUserId() throws Exception {
        // Arrange
        Long userId = Long.MAX_VALUE;

        // Act
        SseEmitter emitter = sseService.subscribe(userId);

        // Assert
        Map<String, SseEmitter> emitters = getEmittersMap();
        assertTrue(emitters.containsKey(String.valueOf(Long.MAX_VALUE)));
    }

    // Helper method to access private emitters map via reflection
    @SuppressWarnings("unchecked")
    private Map<String, SseEmitter> getEmittersMap() throws Exception {
        Field field = SseService.class.getDeclaredField("emitters");
        field.setAccessible(true);
        return (Map<String, SseEmitter>) field.get(sseService);
    }
}