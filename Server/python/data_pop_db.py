import random
import datetime
import string
from faker import Faker
from pymongo import MongoClient
from bson.objectid import ObjectId


# Initialize Faker and MongoDB client
fake = Faker()
client = MongoClient("mongodb://localhost:27017/")
db = client["pmdb"]  # Replace with your database name

# Collections
projects_collection = db["projects"]
tasks_collection = db["tasks"]

# Generate fake project data
def generate_projects(num_projects=5):
    projects = []
    alphabet = list(string.ascii_lowercase)
    for _ in range(num_projects):
        workload = random.choice(["light", "medium", "heavy"])
        project_name = fake.bs().capitalize()
        while not project_name:
            project_name = fake.bs().capitalize() + [].pop()
        unique_char = random.choice(alphabet)   
        project_name += unique_char 
        projects.append({
            "projectName": project_name,
            "projectId": fake.uuid4(),
            "teamSize": random.randint(3, 20),
            "budget": round(random.uniform(1000, 50000), 2),
            "workload": workload,
            "completionTime": random.randint(30, 365),  # Days to completion
            "tasks": []  # Placeholder for tasks
        })
    return projects

# Generate fake task data
def generate_tasks(num_tasks=10, project_id=None):
    tasks = []
    for _ in range(num_tasks):
        due_date = fake.date_this_year()
        if isinstance(due_date, datetime.date):
            due_date = datetime.datetime(due_date.year, due_date.month, due_date.day)  # Convert to datetime object
        
        tasks.append({
            "title": fake.sentence(nb_words=6).strip("."),
            "description": fake.text(max_nb_chars=100),
            "status": random.choice(["todo", "in-progress", "completed"]),
            "assignTo": fake.name(),
            "dueDate": due_date,
            "estimateDuration": random.randint(1, 14),  # Estimated duration in days
            "project": project_id
        })
    return tasks

# Insert projects and tasks into MongoDB
def insert_fake_data(num_projects=5, tasks_per_project=5):
    projects = generate_projects(num_projects)
    for project in projects:
        # Insert project into MongoDB
        project_id = projects_collection.insert_one(project).inserted_id

        # Generate tasks for the project
        tasks = generate_tasks(tasks_per_project, project_id=ObjectId(project_id))
        task_ids = tasks_collection.insert_many(tasks).inserted_ids

        # Update the project's task list with the task IDs
        projects_collection.update_one(
            {"_id": project_id},
            {"$set": {"tasks": list(task_ids)}}
        )


insert_fake_data(num_projects=3, tasks_per_project=4)
print("Fake data inserted into MongoDB!")
