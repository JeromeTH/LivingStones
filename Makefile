.PHONY: build-front
build-front:
	cd frontend && npm run build && cd ..

.PHONY: runserver
runserver:
	python3 manage.py runserver 127.0.0.1:8000

collectstatic:
	python manage.py collectstatic --noinput

daphne:
	daphne -b 0.0.0.0 -p 8000 livingstones.asgi:application

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

re-build-run:
	cd frontend && npm run build && cd .. && python manage.py collectstatic --noinput && daphne -b 0.0.0.0 -p 8000 livingstones.asgi:application

debug:
	python3 debug.py