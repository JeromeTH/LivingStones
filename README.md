# LivingStones

LivingStones is a monster fighting game where users can battle NPCs (Non-Player Characters). The game is built with a Django backend and a React frontend, and it uses Nginx as the production server. The project aims to provide an engaging and interactive experience with real-time updates, sound effects, and animations.

## Table of Contents
## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Development Steps](#development-steps)
- [Docker Server and Deployment](#docker-server-and-deployment)
- [Usage](#usage)
- [Useful Commands](#useful-commands)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Real-Time Battles**: Users can fight against NPCs with real-time updates.
- **Multiple NPCs**: Each game can potentially feature multiple NPCs (future development).
- **Leaderboard**: Tracks the total damage done to NPCs by each user.
- **Sound and Visual Effects**: Enhanced gaming experience with sound and animations during attacks.
- **Game Management**: Create games with custom names and select existing NPCs from the database.

## Tech Stack
- **Frontend**: React
- **Backend**: Django, SQLite
- **Server**: Daphne (for WebSockets), Whitenoise (for static files)
- **Production Server**: Nginx
- **Deployment**: Docker, AWS Light Sail

## Installation

### Prerequisites
- **Docker**: Docker is a platform for developing, shipping, and running applications inside containers. Install Docker from the official website:
    ```sh
    # For Ubuntu
    sudo apt-get update
    sudo apt-get install \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io

    # For macOS
    brew install --cask docker

    # For Windows
    Download and install Docker Desktop from https://www.docker.com/products/docker-desktop
    ```

- **Docker Compose**: A tool for defining and running multi-container Docker applications. Install Docker Compose from the official website:
    ```sh
    # For Ubuntu
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # For macOS and Windows
    Docker Desktop includes Docker Compose, no separate installation is needed.
    ```

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine. Install Node.js from the official website:
    ```sh
    # For Ubuntu
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # For macOS
    brew install node

    # For Windows
    Download the Windows installer from https://nodejs.org and run the installation.
    ```

- **Python 3.x**: A programming language that lets you work quickly and integrate systems more effectively. Install Python 3.x from the official website:
    ```sh
    # For Ubuntu
    sudo apt-get update
    sudo apt-get install python3 python3-venv python3-pip

    # For macOS
    brew install python

    # For Windows
    Download the installer from https://www.python.org and run the installation.
    ```

- **AWS CLI**: A unified tool to manage your AWS services. Install the AWS CLI from the official website:
    ```sh
    # For Ubuntu
    sudo apt-get update
    sudo apt-get install awscli

    # For macOS
    brew install awscli

    # For Windows
    Download and run the AWS CLI MSI installer from https://aws.amazon.com/cli/
    ```

### Development Steps
1. **Clone the repository**:
    ```sh
    git clone https://github.com/jerometh/livingstones.git
    cd livingstones
    ```

2. **Setup Backend**:
    ```sh
    python -m venv livingstonesenv
    source livingstonesenv/bin/activate
    pip install -r requirements.txt
    python manage.py makemigrations livingstonesapp
    python manage.py migrate
    ```

3. **Setup Frontend**:
    ```sh
    cd ../frontend
    npm install
    npm run build
    ```
4. **Start Development Server**:
   ```shell
   #daphne server supports websockets while default django server doesn't
   daphne -b 0.0.0.0 -p 8000 livingstones.asgi:application
   #browse localhost:8000 in browser
   ```


## Docker Server and Deployment

*Identical for localhost and server*
1. **Build Docker Images**
   ```shell
   docker-compose build
   ```
2. **Start Docker Server**:
    ```sh
    docker-compose up
    ```
3. To connect server with a domain ex. stonesliving.com, please follow: 
https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-point-domain-to-distribution.html


## Usage
1. **Access the Application**:
    Open your web browser and navigate to `http://localhost`.

2. **Creating a Game**:
    - Navigate to the game creation page.
    - Input the game name.
    - Select existing NPCs from the database or create a new one.

3. **Playing the Game**:
    - Join a game from the list.
    - Engage in battles with NPCs.
    - Enjoy sound effects and animations during attacks.

## Deployment
1. **Set ssh to remote server**: 
   
   ```sh
    vim ~/.ssh/config
   ```
   ```text
    #your ssh config should be something like this: 
    Host ls-deploy
    Hostname 3.39.185.37
    User ec2-user
    IdentityFile ~/.ssh/LightsailDefaultKey-ap-northeast-2.pem
    ForwardAgent yes
   ```
    ```shell
    ssh ls-deploy 
    ```
   
2. **Pull the project to server**:
    ```sh
    git clone https://github.com/jerometh/livingstones.git
    ```

3. **Start running the Docker Containers**
    follow the instructions here [Docker Server and Deployment](#docker-server-and-deployment)
4. Visit the website on browser

## Useful Commands
1. **Get website response in terminal**
    ```shell
    curl <url>
    ```
2. ** Enter the file structure of the docker container**
    ```shell
   docker exec -it <container_name_or_id> /bin/sh
    ```
    

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the coding standards and write tests for new features.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! If you have any questions, feel free to open an issue or contact the maintainers.

#TODO
show message indicating attack is successful
server database and development database different
add home page link to game page
leaderboard progress bar

game page design

admin page should not be able to choose boss from gameplayers 
that's not in the game

that is causing the accessibility issue because to list the boss candidates
it's causing the issue


127.0.0.1:57653 - - [23/Jun/2024:12:35:22] "POST /livingstonesapp/game/2/attack/" 200 54
Unauthorized: /livingstonesapp/game/2/attack/

1. make root media directory a shared volume for both containers
2. make root directory a shared volume
3. git pull --> re-build --> container is referred to root so it changes as well
4. containers are for managing 
5. remove media from git to avoid confusion. In the code, there
will be mentions to app/media, however, there is no such file,
the actual file is in docker volumes
the reason to do this is that re-build seems to run faster than building everything again
I mean npm run build
use lfs to store build files.
let docker manage the installation and dependencies so I don't need to configure server
but use the code on root server so I don't need to re-build docker everytime

jerometh@Jeromes-MacBook-Pro LivingStones % scp -i ~/.ssh/LightsailDefaultKey-ap-northeast-2.pem ./db/db.sqlite3 ec2-user@3.39.185.37:~/LivingStones/db
scp: dest open "LivingStones/db/db.sqlite3": Permission denied

when I run migrations on server, the migration files
are stored in server not in a docker image, thus


The problem now is: if I everything is contained in docker, then it db will reset during rebuild
if only db in outside, the migrations would be stored in file system thus unable to update that db
if everything is volumed outside, the some operations are not done, like creating static or migrations




now, docker is only for installing environment and server settings
it's gonna be easier to build docker containers this way
everytime the code changes, run container restart
and the restarting process include npm run build as well as collect static

  File "/app/livingstonesapp/views.py", line 174, in attack
    damage = int(request.data.get('damage'))
ValueError: invalid literal for int() with base 10: ''

TODO:
    Add refill function (5)
    Boss jumps when attacked (5) 
    Don't show Boss on leaderboard (3)
    Boss be bigger on screen (3)
    Unauthorized problem (5)
    prevent staff from attacking other members (2)
    visual effect when attack (3)
    Countdown (2)
    Switch color when round changes (4)
    猜拳贏了輸了

docker run -it --rm \
  -v certbot-etc:/etc/letsencrypt \
  -v certbot-var:/var/lib/letsencrypt \
  -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf" \
  -p 80:80 \
  certbot/certbot certonly --webroot \
  --webroot-path=/var/lib/letsencrypt \
  -d stonesliving.com -d www.stonesliving.com

Saving debug log to /var/log/letsencrypt/letsencrypt.log

