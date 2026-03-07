include .env
export

.PHONY: all up setup-elk down clean fclean re

all: up setup-elk

up:
	docker compose up -d

setup-elk:
	@while ! curl -s "http://localhost:9200" > /dev/null; do \
		sleep 2; \
	done
	
	@curl -s -X POST -u "elastic:$(ELASTIC_PASSWORD)" \
		-H "Content-Type: application/json" \
		"http://localhost:9200/_security/user/kibana_system/_password" \
		-d '{"password":"$(KIBANA_PASSWORD)"}' > /dev/null

	@docker restart anteiku-kibana > /dev/null

	@while ! curl -s "http://localhost:5601/api/status" > /dev/null; do \
		sleep 5; \
	done
	
	@curl -s -X POST "http://localhost:5601/api/saved_objects/_import?overwrite=true" \
		-H "kbn-xsrf: true" \
		-u "elastic:$(ELASTIC_PASSWORD)" \
		--form file=@./elk/kibana/anteiku_dashboard.ndjson > /dev/null

down clean:
	docker compose down

fclean:
	docker compose down -v
	docker system prune -a

re: fclean all