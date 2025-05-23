# In this Dockerfile, we will add the necessary code to run the NGINX container from the base image
# First, we are creating our container from the base image. After that, we will remove the
#  existing configuration file and then copy our custom NGINX configuration file to the 
#  appropriate location. Since this file (nginx.conf) doesn't exist initially, we will create it. In this 
#  file, we will add code to manage the proxy services.

FROM nginx

RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf