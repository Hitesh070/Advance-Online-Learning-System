import json

class Student:
    def __init__(self, name, roll_no, grade):
        self.name = name
        self.roll_no = roll_no
        self.grade = grade

    def __str__(self):
        return f"Name: {self.name} | Roll No: {self.roll_no} | Grade: {self.grade}"

class StudentManagement:
    def __init__(self):
        self.students = []

    def add_student(self, student):
        if any(s.roll_no == student.roll_no for s in self.students):
            print("Student with this roll number already exists.")
            return
        self.students.append(student)
        print("Student added successfully!")

    def remove_student(self, roll_no):
        for student in self.students:
            if student.roll_no == roll_no:
                self.students.remove(student)
                print("Student removed.")
                return
        print("Student not found.")

    def search_student(self, name):
        found = False
        for s in self.students:
            if s.name.lower() == name.lower():
                print(s)
                found = True
        if not found:
            print("Student not found.")

    def display_students(self):
        if len(self.students) == 0:
            print("No students to display.")
            return
        for student in self.students:
            print(str(student))

    def average_grade(self):
        if not self.students:
            print("No students available to calculate average grade.")
            return 0.0
        total = sum(s.grade for s in self.students)
        avg = total / len(self.students)
        print(f"Average grade: {avg:.2f}")
        return avg

    def save_to_file(self, filename="students.json"):
        try:
            with open(filename, 'w') as f:
                data = [vars(s) for s in self.students]
                json.dump(data, f, indent=4)
                print(f"Data saved to {filename}")
        except Exception as e:
            print(f"Error saving file: {e}")

    def load_from_file(self, filename="students.json"):
        try:
            with open(filename, 'r') as f:
                data = json.load(f)
                self.students = []
                for d in data:
                    student = Student(d["name"], d["roll_no"], d["grade"])
                    self.students.append(student)
                print(f"Data loaded from {filename}")
        except FileNotFoundError:
            print("File not found.")
        except Exception as e:
            print(f"Unknown error occurred: {e}")

def main():
    system = StudentManagement()

    while True:
        print("\n=== Student Management System ===")
        print("1. Add Student")
        print("2. Remove Student")
        print("3. Search Student")
        print("4. Display All")
        print("5. Average Grade")
        print("6. Save to File")
        print("7. Load from File")
        print("8. Exit")

        try:
            choice = int(input("Enter your choice (1-8): "))
        except ValueError:
            print("Invalid input! Please enter a number between 1 and 8.")
            continue

        if choice == 1:
            name = input("Enter name: ").strip()
            roll_no = input("Enter roll number: ").strip()
            try:
                grade = float(input("Enter grade (0-100): "))
                if grade < 0 or grade > 100:
                    print("Grade must be between 0 and 100.")
                    continue
            except ValueError:
                print("Invalid grade format. Must be a number.")
                continue

            s = Student(name, roll_no, grade)
            system.add_student(s)

        elif choice == 2:
            r = input("Enter roll number to remove: ").strip()
            system.remove_student(r)

        elif choice == 3:
            n = input("Enter name to search: ").strip()
            system.search_student(n)

        elif choice == 4:
            system.display_students()

        elif choice == 5:
            system.average_grade()

        elif choice == 6:
            f = input("Enter filename to save [default: students.json]: ").strip() or "students.json"
            system.save_to_file(f)

        elif choice == 7:
            f = input("Enter filename to load [default: students.json]: ").strip() or "students.json"
            system.load_from_file(f)

        elif choice == 8:
            print("Exiting system. Goodbye!")
            break

        else:
            print("Invalid choice. Please choose a number from 1 to 8.")

if __name__ == "__main__":
    main()
