import json
import os
import hashlib

class Student:
    """Represents an individual student record in the Advance Online Learning System."""
    def __init__(self, name: str, roll_no: str, grade: float, course: str = "General CS"):
        self.name = name
        self.roll_no = roll_no
        self.grade = float(grade)
        self.course = course

    def to_dict(self):
        return {
            "name": self.name,
            "roll_no": self.roll_no,
            "grade": self.grade,
            "course": self.course
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data["name"],
            roll_no=data["roll_no"],
            grade=data["grade"],
            course=data.get("course", "General CS")
        )

    def __str__(self):
        return f"[{self.roll_no}] {self.name} | Course: {self.course} | Grade: {self.grade:.1f}"

class StudentManager:
    """Manages student operations, data persistence, and analytics."""
    def __init__(self, storage_file="students.json"):
        self.storage_file = storage_file
        self.students = []
        self.load_from_file()

    def add_student(self, name: str, roll_no: str, grade: float, course: str = "General CS") -> tuple[bool, str]:
        roll_no = str(roll_no).strip()
        if not name or not roll_no:
            return False, "Name and Roll Number cannot be empty."

        if any(s.roll_no == roll_no for s in self.students):
            return False, f"Student with Roll No '{roll_no}' already exists."

        if grade < 0 or grade > 100:
            return False, "Grade must be between 0 and 100."

        student = Student(name.strip(), roll_no, grade, course.strip())
        self.students.append(student)
        self.save_to_file()
        return True, "Student added successfully!"

    def remove_student(self, roll_no: str) -> tuple[bool, str]:
        roll_no = str(roll_no).strip()
        for s in self.students:
            if s.roll_no == roll_no:
                self.students.remove(s)
                self.save_to_file()
                return True, f"Student '{s.name}' ({roll_no}) removed."
        return False, "Student not found."

    def update_student(self, roll_no: str, name: str = None, grade: float = None, course: str = None) -> tuple[bool, str]:
        roll_no = str(roll_no).strip()
        for s in self.students:
            if s.roll_no == roll_no:
                if name:
                    s.name = name.strip()
                if grade is not None:
                    if grade < 0 or grade > 100:
                        return False, "Grade must be between 0 and 100."
                    s.grade = float(grade)
                if course:
                    s.course = course.strip()
                self.save_to_file()
                return True, f"Student '{roll_no}' updated successfully."
        return False, "Student not found."

    def search_students(self, query: str = "") -> list[Student]:
        query = query.strip().lower()
        if not query:
            return self.students
        return [
            s for s in self.students
            if query in s.name.lower() or query in s.roll_no.lower() or query in s.course.lower()
        ]

    def get_analytics(self) -> dict:
        if not self.students:
            return {
                "total_students": 0,
                "average_grade": 0.0,
                "highest_grade": 0.0,
                "lowest_grade": 0.0,
                "pass_rate": 0.0
            }

        grades = [s.grade for s in self.students]
        passing_count = sum(1 for g in grades if g >= 50.0)

        return {
            "total_students": len(self.students),
            "average_grade": round(sum(grades) / len(grades), 2),
            "highest_grade": round(max(grades), 2),
            "lowest_grade": round(min(grades), 2),
            "pass_rate": round((passing_count / len(grades)) * 100, 1)
        }

    def save_to_file(self):
        try:
            with open(self.storage_file, "w") as f:
                json.dump([s.to_dict() for s in self.students], f, indent=4)
        except Exception as e:
            print(f"Error saving students: {e}")

    def load_from_file(self):
        if not os.path.exists(self.storage_file):
            # Seed with sample data if no file exists yet
            self.students = [
                Student("Alice Smith", "101", 92.5, "Data Science"),
                Student("Bob Johnson", "102", 78.0, "Computer Science"),
                Student("Charlie Brown", "103", 85.5, "AI & Machine Learning"),
                Student("Diana Prince", "104", 95.0, "Software Engineering"),
                Student("Ethan Hunt", "105", 64.0, "Cybersecurity")
            ]
            self.save_to_file()
            return

        try:
            with open(self.storage_file, "r") as f:
                data = json.load(f)
                self.students = [Student.from_dict(item) for item in data]
        except Exception as e:
            print(f"Error loading students: {e}")
            self.students = []

class UserManager:
    """Manages user authentication and registration."""
    def __init__(self, storage_file="users.json"):
        self.storage_file = storage_file
        self.users = {}
        self.load_users()

    def _hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    def register_user(self, username: str, password: str) -> tuple[bool, str]:
        username = username.strip()
        if not username or not password:
            return False, "Username and password cannot be empty."

        if len(password) < 4:
            return False, "Password must be at least 4 characters long."

        if username.lower() in [u.lower() for u in self.users.keys()]:
            return False, f"Username '{username}' is already taken."

        self.users[username] = self._hash_password(password)
        self.save_users()
        return True, f"Account created successfully for {username}!"

    def authenticate(self, username: str, password: str) -> tuple[bool, str]:
        username = username.strip()
        if not username or not password:
            return False, "Please enter both username and password."

        # Case insensitive matching for username
        user_key = None
        for existing_user in self.users:
            if existing_user.lower() == username.lower():
                user_key = existing_user
                break

        if not user_key:
            return False, "User not found. Please create an account first."

        if self.users[user_key] == self._hash_password(password):
            return True, f"Welcome back, {user_key}!"
        else:
            return False, "Incorrect password."

    def save_users(self):
        try:
            with open(self.storage_file, "w") as f:
                json.dump(self.users, f, indent=4)
        except Exception as e:
            print(f"Error saving users: {e}")

    def load_users(self):
        if not os.path.exists(self.storage_file):
            # Seed default admin user
            self.users = {
                "admin": self._hash_password("admin123"),
                "teacher": self._hash_password("learn2026")
            }
            self.save_users()
            return

        try:
            with open(self.storage_file, "r") as f:
                self.users = json.load(f)
        except Exception as e:
            print(f"Error loading users: {e}")
            self.users = {}