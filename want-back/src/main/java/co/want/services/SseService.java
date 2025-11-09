package co.want.services;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SseService {
	private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
	private final ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * SSE Subscribe Add or remove subscription
	 */
	public SseEmitter subscribe(Long userId) {
		SseEmitter emitter = new SseEmitter(0L);
		emitters.put(String.valueOf(userId), emitter); // { key, value }
		emitter.onCompletion(() -> emitters.remove(String.valueOf(userId)));
		emitter.onError((e) -> emitters.remove(String.valueOf(userId)));
		System.out.println(userId + "subscribed");
		return emitter;
	}

	/**
	 * 
	 * @param mySelf  = userId (author)
	 * @param message
	 */
	public void sendNotification(Long authorId, Long likerId) {
		SseEmitter emitter = emitters.get(String.valueOf(authorId));
		if (emitter != null) {
			try {
				String json = objectMapper.writeValueAsString(Map.of("author", authorId, "liker", likerId));
				// send to author
				System.out.println(json);
				emitter.send(SseEmitter.event().name("message").data(json));
			} catch (IOException e) {
				emitters.remove(String.valueOf(authorId));
			}
		}
	}
}