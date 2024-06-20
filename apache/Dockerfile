# Use an official Apache runtime as a parent image
FROM httpd:2.4

# Copy Apache vhost file to proxy incoming requests and start Apache
COPY apache.conf /usr/local/apache2/conf/httpd.conf

# Optionally, copy additional configuration files or web content
# COPY ./path/to/your/additional/files /usr/local/apache2/

# Expose port 80 to the outside world
EXPOSE 80

# Start Apache in the foreground
CMD ["httpd", "-D", "FOREGROUND"]
