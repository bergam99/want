package co.want;

import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Transactional
public abstract class BaseIT extends BaseMvcTests {

    @PersistenceContext
    private EntityManager em;

    private static String jpql(final String query, final Object... params) {
	return String.format(query, params);
    }

    protected final <T> T findEntity(final Class<T> type, final String query,
	    Object... params) {
	final var jpql = jpql(query, params);
	return em.createQuery(jpql, type).getSingleResult();
    }

}
