Deploying MERN Stack Project on Hostinger VPS
Preparing the VPS Environment
Setting Up the MongoDB Database
Deploying the Express and Node.js Backend
Deploying the React Frontends
Configuring Nginx as a Reverse Proxy
Setting Up SSL Certificates
1. Preparing the VPS Environment
Get you VPS Hosting here : Hostinger VPS
Log in to Your VPS in Terminal

 ssh root@your_vps_ip
Update and Upgrade Your System

  sudo apt update
  sudo apt upgrade -y
Install Node.js and npm ( if not pre-installed)

  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  \. "$HOME/.nvm/nvm.sh"
  nvm install 22
Install Git

  sudo apt install -y git
2. Setting Up the MongoDB Database
If you want to setup MongoDB on VPS Follow this Guide: click here

3. Deploying the Express and Node.js Backend
Clone Your Backend Repository

 mkdir /var/www
 cd /var/www
 git clone https://github.com/yourusername/your-repo.git
 cd your-repo/backend
Install Dependencies

 npm install
Create .env file & configure Environment Variables

 nano .env
add environment variables then save and exit (Ctrl + X, then Y and Enter).

Installing pm2 to Start Backend

 npm install -g pm2
 pm2 start server.js --name project-backend
Start Backend on startup

 pm2 startup
 pm2 save
Allowing backend port in firewall

 sudo ufw status
If firewall is disable then enable it using

 sudo ufw enable
 sudo ufw allow 'OpenSSH'
 sudo ufw allow 4000
4. Deploying the React Frontends
Creating Build of React Applications

 cd path-to-your-first-react-app
 npm install
If you have ".env" file in your project

Create .env file and paste the variables

 nano .env
Create build of project

 npm run build
Repeat for the second or mulitiple React app.

Install Nginx

 sudo apt install -y nginx
adding Nginx in firewall

 sudo ufw status
 sudo ufw allow 'Nginx Full'
Configure Nginx for React Frontends

 nano /etc/nginx/sites-available/yourdomain1.com.conf
 server {
    listen 80;
    server_name yourdomain1.com www.yourdomain1.com;

    location / {
        root /var/www/your-repo/frontend/dist;
        try_files $uri /index.html;
    }
}
Save and exit (Ctrl + X, then Y and Enter).

Create a similar file for the second or multiple React app.

 nano /etc/nginx/sites-available/yourdomain2.com.conf
server {
    listen 80;
    server_name yourdomain2.com www.yourdomain2.com;

    location / {
        root /var/www/react-app-2/dist;
        try_files $uri /index.html;
    }
}
Create symbolic links to enable the sites.

ln -s /etc/nginx/sites-available/yourdomain1.com.conf /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/yourdomain2.com.conf /etc/nginx/sites-enabled/
Test the Nginx configuration for syntax errors.

nginx -t
systemctl restart nginx
5. Configuring Nginx as a Reverse Proxy
Update Backend Nginx Configuration

nano /etc/nginx/sites-available/api.yourdomain.com.conf
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Create symbolic links to enable the sites.

ln -s /etc/nginx/sites-available/api.yourdomain.com.conf /etc/nginx/sites-enabled/
Restart nginx

systemctl restart nginx
Connect Domain Name with Website
Point all your domain & sub-domain on VPS IP address by adding DNS records in your domain manager

Now your website will be live on domain name

6. Setting Up SSL Certificates
Install Certbot

sudo apt install -y certbot python3-certbot-nginx
Obtain SSL Certificates

certbot --nginx -d yourdomain1.com -d www.yourdomain1.com -d yourdomain2.com -d api.yourdomain.com
Verify Auto-Renewal

certbot renew --dry-run
