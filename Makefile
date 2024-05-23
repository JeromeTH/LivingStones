.PHONY: build-front
build-front:
	cd frontend && npm run build && cd ..

.PHONY: runserver
runserver:
	python3 manage.py runserver

.PHONY: clean
clean:
	cd frontend && npm run clean && cd ..
	find . -name '*.pyc' -delete
	find . -name '__pycache__' -delete
	rm -rf frontend/build
migrate:
	python3 manage.py makemigrations && python3 manage.py migrate


activate-env:
	source livingstonesenv/bin/activate
