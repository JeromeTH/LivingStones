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


## Docker Server

*One can use a server of one's choice. This example is conducted on Amazon LightSail Server.*

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

3. Obtain domain registration and configure nginx.conf. Follow instructions here: 
https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-domain-registration.html
4. **Start running the Docker Containers**
    follow the instructions here [Docker Server and Deployment](#docker-server-and-deployment)
5. Visit the website on browser

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

## TODO
- I successfully enabled HTTPS secure connection by obtaining certificates using Certbot and reconfiguring `nginx.conf`.
- However, the websocket connection needs to also be securely configured, which hasn't been done yet. This is a future direction.

### To create SSL credentials:
Note: stoneliving.com should be changed to your doomain name 
```bash
docker run -it --rm \
    -v livingstones_certbot-etc:/etc/letsencrypt \
    -v livingstones_certbot-var:/var/lib/letsencrypt \
    -p 80:80 certbot/certbot certonly --standalone \
    -d stonesliving.com
```
### To check that SSL credentials are successfully created:
```bash
docker run -it --rm \
  -v livingstones_certbot-etc:/etc/letsencrypt \
  busybox sh -c "ls -l /etc/letsencrypt/live/stonesliving.com/; ls -l /etc/letsencrypt/archive/stonesliving.com/"
```
