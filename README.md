# Project management

Add project | task | and AI model to predict the completion time

![home page](https://github.com/TimothyGermano/Project_Management/blob/dev/resources/capdemo1.png)

![add project page](https://github.com/TimothyGermano/Project_Management/blob/dev/resources/capdemo2.png)

![add task page](https://github.com/TimothyGermano/Project_Management/blob/dev/resources/capdemo3.png)

## Run locally

From the root folder (Project_Management) of the project

1. Navigate into the Server folder (in the terminal or command line)
    - run command: `./ipackage` (this will install the dependencies needed for the server)
    - open 2 different terminals in the Server folder
    - run commands: `cd python` and `python app.py` or `python3 app.py` (this will run the python (flask) server)
    - run command: `npm run dev` (this runs the node (express) server), this is in the server folder, not the python server
    - verify that servers are running
  
2. Open a third terminal and navigate to the Project_Management folder
     - cd /path/to/Project_Management/
     - run command: `npm i`  or `npm install` (this will install all the dependencies needed for the frontend)
     - run command: `npm run dev` (this will start the frontend)


``` 
If there is any error while installing the tendencies inspect the package.json for the
frontend-end and the node server and the requirements.txt for the Python server
```



