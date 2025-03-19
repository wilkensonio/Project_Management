# import csv
# import random
# import string
# from faker import Faker
# import uuid
# from datetime import datetime, timedelta

# # Initialize Faker
# fake = Faker()

# # Function to generate a unique project name
# def generate_unique_project_name(existing_names):
#     while True:
#         project_name = fake.bs().capitalize() + str(random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ'))
#         if project_name not in existing_names:
#             existing_names.add(project_name)
#             return project_name


# # Function to generate project data
# def generate_project(existing_names):
#     project_name = generate_unique_project_name(existing_names)
#     completion_time = datetime.now() + timedelta(days=random.randint(30, 365))  # Random date in the future
#     return {
#         "projectName": project_name,
#         "projectId": str(uuid.uuid4()),
#         "teamSize": random.randint(3, 20),
#         "budget": round(random.uniform(1000, 50000), 2),
#         "workload": random.choice(["light", "medium", "heavy"]),
#         "completionTime": completion_time.strftime("%Y-%m-%d %H:%M:%S"),  # Date in the correct format
#     }

# # Function to generate task data associated with a project
# def generate_task(project_id):
#     due_date = fake.date_this_year()
#     due_date = datetime.strptime(str(due_date), "%Y-%m-%d")  # Convert to datetime object
#     return {
#         "title": fake.sentence(nb_words=6).strip("."),
#         "description": fake.text(max_nb_chars=100),
#         "status": random.choice(["todo", "in-progress", "completed"]),
#         "assignTo": fake.name(),
#         "dueDate": due_date.strftime("%Y-%m-%d"),
#         "estimateDuration": random.randint(1, 14),
#         "projectId": project_id,  # Associate task with project
#     }

# # Generate CSV data
# def generate_csv(num_projects=1000, num_tasks_per_project=5, filename="project_task_data.csv"):
#     project_data = []
#     task_data = []
#     existing_project_names = set()  # Set to keep track of unique project names

#     # Generate projects and tasks
#     for _ in range(num_projects):
#         # Create a project
#         project = generate_project(existing_project_names)
#         project_id = project["projectId"]
#         project_data.append(project)

#         # Generate tasks for this project
#         for _ in range(num_tasks_per_project):
#             task = generate_task(project_id)
#             task_data.append(task)

#     # Write project data to CSV
#     with open(filename, mode='w', newline='', encoding='utf-8') as file:
#         writer = csv.DictWriter(file, fieldnames=["projectName", "projectId", "teamSize", "budget", "workload", "completionTime", "tasks"])
#         writer.writeheader()

#         for project in project_data:
#             project['tasks'] = len(task_data)  # Add number of tasks for each project (or task ids if needed)
#             writer.writerow(project)

#     print(f"CSV file '{filename}' has been generated with {num_projects} projects and {num_tasks_per_project * num_projects} tasks.")

# # Run the script to generate the CSV
# generate_csv(num_projects=1001, num_tasks_per_project=5, filename="project_task_data.csv")

import csv
import random
import string
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker()

# Function to generate a unique project name
def generate_unique_project_name(existing_names):
    while True:
        project_name = fake.bs().capitalize() + str(random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ'))
        if project_name not in existing_names:
            existing_names.add(project_name)
            return project_name

# Function to generate a 5-character long alphanumeric projectId
def generate_project_id():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=5))

# Function to generate project data
def generate_project(existing_names):
    project_name = generate_unique_project_name(existing_names)
    completion_time = datetime.now() + timedelta(days=random.randint(30, 365))  # Random date in the future
    return {
        "projectName": project_name,
        "projectId": generate_project_id(),
        "teamSize": random.randint(3, 20),
        "budget": round(random.uniform(1000, 50000), 2),
        "workload": random.choice(["light", "medium", "heavy"]),
        "completionTime": completion_time.strftime("%Y-%m-%d %H:%M:%S"),  # Date in the correct format
    }

# Function to generate task data associated with a project
def generate_task(project_id):
    due_date = fake.date_this_year()
    due_date = datetime.strptime(str(due_date), "%Y-%m-%d")  # Convert to datetime object
    estimate_duration = random.randint(1, 14)  # Estimate duration in days
    return {
        "title": fake.sentence(nb_words=6).strip("."),
        "description": fake.text(max_nb_chars=100),
        "status": random.choice(["todo", "in-progress", "completed"]),
        "assignTo": fake.name(),
        "dueDate": due_date.strftime("%Y-%m-%d"),
        "estimateDuration": estimate_duration,
        "projectId": project_id,  # Associate task with project
    }

# Generate CSV data
def generate_csv(num_projects=1000, num_tasks_per_project=5, filename="project_task_data.csv"):
    project_data = []
    task_data = []
    existing_project_names = set()  # Set to keep track of unique project names

    # Generate projects and tasks
    for _ in range(num_projects):
        # Create a project
        project = generate_project(existing_project_names)
        project_id = project["projectId"]
        project_data.append(project)

        # Generate tasks for this project
        total_estimate_duration = 0  # To accumulate the total estimated duration for all tasks
        for _ in range(num_tasks_per_project):
            task = generate_task(project_id)
            task_data.append(task)
            total_estimate_duration += task["estimateDuration"]  # Accumulate the task's estimateDuration

        # Add the total estimate duration to the project
        project["estimateDuration"] = total_estimate_duration

    # Write project data to CSV
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["projectName", "projectId", "teamSize", "budget", "workload", "completionTime", "estimateDuration", "tasks"])
        writer.writeheader()

        for project in project_data:
            project['tasks'] = len(task_data)  # Add number of tasks for each project (or task ids if needed)
            writer.writerow(project)

    print(f"CSV file '{filename}' has been generated with {num_projects} projects and {num_tasks_per_project * num_projects} tasks.")

# Run the script to generate the CSV
generate_csv(num_projects=1000, num_tasks_per_project=5, filename="project_task_data.csv")
