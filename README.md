add game restart button

if enter deprecated game, then see it's last leaderboard

when creating new game, use least unused index

add game name

standardize different navigation methods

window.href
navigate
<link> 
<a>


game and game summary, correctly retrieve past leaderboard. 
todo: 
1. game's historical attacks, create game-attack table
2. Debug game logic
4. https://www.w3schools.com/graphics/game_intro.asp
5. Bug: total attack value should not be more than npc blood level
6. https://aws.amazon.com/tutorials/deploy-webapp-lightsail/

implement the moving blood bar (add total blood attribute to the NPC object)


Client
   |
   v
Nginx (Reverse Proxy)
   |
   |--> Serve Static Files (React build files, media, static assets)
   |
   |--> Proxy API Requests /api/ to Daphne (Django backend)
   |
   |--> Proxy Web Socket Connections /ws/ to Daphne (Django backend)


# Build the Django image
docker build -t your-django-image -f Dockerfile-django .

# Build the React image
docker build -t your-react-image -f Dockerfile-react .

# Build the Nginx image
docker build -t your-nginx-image -f Dockerfile-nginx .


# Push the Django image
docker push your-django-image

# Push the React image
docker push your-react-image

# Push the Nginx image
docker push your-nginx-image

kubectl apply -f k8s/django-deployment.yaml
kubectl apply -f k8s/django-service.yaml
kubectl apply -f k8s/react-deployment.yaml
kubectl apply -f k8s/react-service.yaml
kubectl apply -f k8s/nginx-deployment.yaml
kubectl apply -f k8s/nginx-service.yaml

LivingStones/
├── livingstones/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── livingstonesapp/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   └── ...
├── static/
├── media/
├── Dockerfile-django
├── Dockerfile-react
├── Dockerfile-nginx
├── docker-compose.yml
└── k8s/
    ├── django-deployment.yaml
    ├── django-service.yaml
    ├── react-deployment.yaml
    ├── react-service.yaml
    ├── nginx-deployment.yaml
    └── nginx-service.yaml



Full Deployment Steps
Build Docker Images:


# Build the Django image
docker build -t your-django-image -f Dockerfile-django .

# Build the React image
docker build -t your-react-image -f Dockerfile-react .

# Build the Nginx image
docker build -t your-nginx-image -f Dockerfile-nginx .

Push Docker Images to Amazon ECR:
# Authenticate Docker to your ECR registry
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com

# Tag and push images
docker tag your-django-image:latest your-account-id.dkr.ecr.your-region.amazonaws.com/your-django-repo:latest
docker tag your-react-image:latest your-account-id.dkr.ecr.your-region.amazonaws.com/your-react-repo:latest
docker tag your-nginx-image:latest your-account-id.dkr.ecr.your-region.amazonaws.com/your-nginx-repo:latest

docker push your-account-id.dkr.ecr.your-region.amazonaws.com/your-django-repo:latest
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/your-react-repo:latest
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/your-nginx-repo:latest

Create Persistent Volume and Claim for SQLite:
Create sqlite-pv.yaml and sqlite-pvc.yaml in the LivingStones/k8s/ directory.


# LivingStones/k8s/sqlite-pv.yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: sqlite-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"


# LivingStones/k8s/sqlite-pvc.yaml

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sqlite-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi

Apply the Persistent Volume and Persistent Volume Claim:

kubectl apply -f k8s/sqlite-pv.yaml
kubectl apply -f k8s/sqlite-pvc.yaml

Apply Kubernetes Manifests:

kubectl apply -f k8s/django-deployment.yaml
kubectl apply -f k8s/django-service.yaml
kubectl apply -f k8s/react-deployment.yaml
kubectl apply -f k8s/react-service.yaml
kubectl apply -f k8s/nginx-deployment.yaml
kubectl apply -f k8s/nginx-service.yaml



local deployment 
# Build the Django image
docker-compose build django

# Build the React image
docker-compose build react

# Build the Nginx image
docker-compose build nginx


docker-compose up

/usr/local/etc/nginx/nginx.conf
brew services start nginx

docker-compose up -d --force-recreate nginx
 docker-compose logs -f   

deployment server IP: 


sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
exit
ssh -i ~/.ssh/LightsailDefaultKey-ap-northeast-2.pem ec2-user@13.125.95.45
docker --version

sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version

https://www.whatsmydns.net/#A/stonesliving.com
django  | Invalid HTTP_HOST header: '13.125.95.45'. You may need to add '13.125.95.45' to ALLOWED_HOSTS.
django  | Traceback (most recent call last):
django  |   File "/usr/local/lib/python3.11/site-packages/django/core/handlers/exception.py", line 55, in inner
django  |     response = get_response(request)
django  |                ^^^^^^^^^^^^^^^^^^^^^
django  |   File "/usr/local/lib/python3.11/site-packages/django/utils/deprecation.py", line 133, in __call__
django  |     response = self.process_request(request)
django  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
django  |   File "/usr/local/lib/python3.11/site-packages/django/middleware/common.py", line 48, in process_request
django  |     host = request.get_host()
django  |            ^^^^^^^^^^^^^^^^^^
django  |   File "/usr/local/lib/python3.11/site-packages/django/http/request.py", line 151, in get_host
django  |     raise DisallowedHost(msg)
django  | django.core.exceptions.DisallowedHost: Invalid HTTP_HOST header: '13.125.95.45'. You may need to add '13.125.95.45' to ALLOWED_HOSTS.
django  | 2024-06-04 09:00:12,886 ERROR    Invalid HTTP_HOST header: '13.125.95.45'. You may need to add '13.125.95.45' to ALLOWED_HOSTS.
django  | Traceback (most recent call last):
django  |   File "/usr/local/lib/python3.11/site-packages/django/core/handlers/exception.py", line 55, in inner
django  |     response = get_response(request)
django  |                ^^^^^^^^^^^^^^^^^^^^^
django  |   File "/usr/local/lib/python3.11/site-packages/django/utils/deprecation.py", line 133, in __call__
django  |     response = self.process_request(request)
django  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
django  |   File "/usr/local/lib/python3.11/site-packages/django/middleware/common.py", line 48, in process_request
django  |     host = request.get_host()
django  |            ^^^^^^^^^^^^^^^^^^
django  |   File "/usr/local/lib/python3.11/site-packages/django/http/request.py", line 151, in get_host
django  |     raise DisallowedHost(msg)
django  | django.core.exceptions.DisallowedHost: Invalid HTTP_HOST header: '13.125.95.45'. You may need to add '13.125.95.45' to ALLOWED_HOSTS.
django  | Bad Request: /
django  | 2024-06-04 09:00:13,365 WARNING  Bad Request: /
django  | 172.18.0.4:51246 - - [04/Jun/2024:09:00:13] "GET /" 400 58316
nginx   | 170.106.159.160 - - [04/Jun/2024:09:00:13 +0000] "GET / HTTP/1.1" 400 58385 "-" "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"

