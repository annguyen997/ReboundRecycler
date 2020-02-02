# ReboundRecycler
A crowdsourcing tool that permits users to monetize the work of collecting trash, recyclables, and other items as well as litter.
Try it out at:  wecleanour.space. 

A Hoya Hacks 2020 hack (Georgetown University)

# Inspiration
To expand the prompt on the climate change theme to include other environmental issues, we thought of ways of reducing or recycling trash and other waste, since creating resources does also produce greenhouse gases that contribute to warming global temperatures associated with climate change. We also would like to utilize a social incentive to help educate and motivate others on the risks associated with high resource consumption of single-use products and/or poor waste management that affect our environment, climate, health and overall well-being.

# What it does
The application permits users to tag current locations of trash/litter located around the world. This is done if that user locates an item, but either needs assistance or is not able to collect at this time. The application tags the location as a "bounty" for another user to either assist in the trash or collect the trash on the original poster's behalf. The original poster then compensates the assistant with some monetary value (as an incentive).

# How We Built It
This software is developed using Python using the Flask framework to form the RESTful back-end of the application (e.g. CRUD). Python is also used to connect with the non-SQL DBMS MongoDB Atlas, which currently stores our application's collections of data, via PyMongo. The data is represented in JSON, which is manipulated using another Python library including BSON and JSON. Python is also used to interface with the front-end of the application, which is built using the JavaScript framework ReactJS (in addition to the standard HTML and CSS). Node.js is also used to interact with the Google Maps API and other front-end mechanisms. The version control used for this project is Git, with the project stored on GitHub. The graphics associated with this software was created using Adobe Photoshop, which utilizes SVG.

The application is containerized using Docker, which then is stored on Google Cloud Platform. The site's web-based interface will be hosted on Domain.com.

# Challenges I ran into
Google Cloud was problematic at times due to server issues. Learning MongoDB also took a significant period of time due to the fact we need to learn how to create the RESTful functions using Flask and integrate with MongoDB.

# Accomplishments that I'm proud of
We are able to learn a lot of new technologies in this hackathon, which includes Flask, MongoDB, Google Cloud Platform, ReactJS within a short period of time and able to utilize the concept of REST

# What I learned
In addition to the accomplishments noted, we were also able to learned team collaboration given our wide range of backgrounds.

# What's next for rebound-recycler
We would like to implement additional logic to store pictures as well as user login information for a more robust and personalized experience.
