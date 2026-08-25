import os
import sys

# Try importing tkinter / customtkinter safely
try:
    import customtkinter as ctk
    CTK_AVAILABLE = True
except ImportError:
    import tkinter as ctk
    CTK_AVAILABLE = False

import tkinter as tk
from tkinter import ttk, messagebox

try:
    from PIL import Image, ImageTk
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

from back_end import StudentManager, UserManager

# Safe helper for popups
def show_info(title, message, parent=None):
    try:
        from CTkMessagebox import CTkMessagebox
        CTkMessagebox(title=title, message=message, icon="info")
    except Exception:
        messagebox.showinfo(title, message, parent=parent)

def show_error(title, message, parent=None):
    try:
        from CTkMessagebox import CTkMessagebox
        CTkMessagebox(title=title, message=message, icon="cancel")
    except Exception:
        messagebox.showerror(title, message, parent=parent)

class AdvanceLearningApp:
    def __init__(self):
        if CTK_AVAILABLE:
            ctk.set_appearance_mode("light")
            ctk.set_default_color_theme("green")
            self.root = ctk.CTk()
        else:
            self.root = tk.Tk()

        self.root.title("Advance Online Learning System")
        self.root.geometry("900x600")
        self.root.minsize(850, 550)

        # Core Backend Managers
        self.user_mgr = UserManager()
        self.student_mgr = StudentManager()

        # Build Login Frame
        self.build_login_screen()

    def build_login_screen(self):
        # Clear existing widgets
        for widget in self.root.winfo_children():
            widget.destroy()

        if CTK_AVAILABLE:
            main_frame = ctk.CTkFrame(self.root, fg_color="white")
            main_frame.pack(fill="both", expand=True)

            # Left side image / banner
            left_frame = ctk.CTkFrame(main_frame, fg_color="#1E3A8A")
            left_frame.pack(side="left", fill="both", expand=True)

            # Build left banner text
            self._build_left_banner_text(left_frame)

            # Right side form frame
            right_frame = ctk.CTkFrame(main_frame, width=420, fg_color="white")
            right_frame.pack(side="right", fill="both", expand=False, padx=30, pady=30)
            right_frame.pack_propagate(False)

            title_label = ctk.CTkLabel(
                right_frame,
                text="Advance Online Learning",
                font=("Arial", 22, "bold"),
                text_color="#006400"
            )
            title_label.pack(pady=(30, 5))

            quote_label = ctk.CTkLabel(
                right_frame,
                text="'When tradition meets innovation,\nthe soil grows not just crops,\nbut the future.'",
                font=("Arial", 13, "italic"),
                text_color="#4B5563"
            )
            quote_label.pack(pady=(0, 30))

            # Username
            self.username_entry = ctk.CTkEntry(
                right_frame, width=280, height=40, placeholder_text="Username"
            )
            self.username_entry.pack(pady=(0, 15))

            # Password
            self.password_entry = ctk.CTkEntry(
                right_frame, width=280, height=40, show="*", placeholder_text="Password"
            )
            self.password_entry.pack(pady=(0, 20))

            # Login Button
            login_btn = ctk.CTkButton(
                right_frame,
                text="Sign In",
                width=280,
                height=40,
                command=self.handle_login,
                fg_color="#10B981",
                hover_color="#059669",
                font=("Arial", 14, "bold")
            )
            login_btn.pack(pady=(0, 12))

            # Create Account Button
            create_btn = ctk.CTkButton(
                right_frame,
                text="Create an Account",
                width=280,
                height=40,
                command=self.handle_create_account,
                fg_color="#F59E0B",
                hover_color="#D97706",
                text_color="black",
                font=("Arial", 14, "bold")
            )
            create_btn.pack(pady=(0, 10))

            hint_label = ctk.CTkLabel(
                right_frame,
                text="Default Admin: admin / admin123",
                font=("Arial", 11),
                text_color="#6B7280"
            )
            hint_label.pack(side="bottom", pady=10)

        else:
            # Tkinter Fallback UI
            frame = tk.Frame(self.root, bg="#F3F4F6", padx=40, pady=40)
            frame.pack(fill="both", expand=True)

            tk.Label(frame, text="Advance Online Learning System", font=("Arial", 20, "bold"), bg="#F3F4F6", fg="#006400").pack(pady=20)
            
            tk.Label(frame, text="Username:", font=("Arial", 12), bg="#F3F4F6").pack(anchor="w", padx=100)
            self.username_entry = tk.Entry(frame, font=("Arial", 12), width=30)
            self.username_entry.pack(pady=5)

            tk.Label(frame, text="Password:", font=("Arial", 12), bg="#F3F4F6").pack(anchor="w", padx=100)
            self.password_entry = tk.Entry(frame, font=("Arial", 12), show="*", width=30)
            self.password_entry.pack(pady=5)

            tk.Button(frame, text="Sign In", command=self.handle_login, bg="#10B981", fg="white", font=("Arial", 12, "bold"), width=20).pack(pady=15)
            tk.Button(frame, text="Create Account", command=self.handle_create_account, bg="#F59E0B", fg="black", font=("Arial", 12, "bold"), width=20).pack(pady=5)

    def _build_left_banner_text(self, parent):
        if CTK_AVAILABLE:
            banner = ctk.CTkLabel(
                parent,
                text="🌱\n\nAdvance Learning Portal\nEmpowering Education",
                font=("Arial", 22, "bold"),
                text_color="white"
            )
            banner.pack(expand=True)

    def handle_login(self):
        user = self.username_entry.get()
        pwd = self.password_entry.get()

        success, msg = self.user_mgr.authenticate(user, pwd)
        if success:
            show_info("Login Success", msg, parent=self.root)
            self.build_dashboard(user)
        else:
            show_error("Login Failed", msg, parent=self.root)

    def handle_create_account(self):
        user = self.username_entry.get()
        pwd = self.password_entry.get()

        success, msg = self.user_mgr.register_user(user, pwd)
        if success:
            show_info("Account Created", msg, parent=self.root)
        else:
            show_error("Registration Failed", msg, parent=self.root)

    def build_dashboard(self, username):
        # Clear login widgets
        for widget in self.root.winfo_children():
            widget.destroy()

        if CTK_AVAILABLE:
            self.root.geometry("1000x650")

            # Main container
            dash_frame = ctk.CTkFrame(self.root, fg_color="#F3F4F6")
            dash_frame.pack(fill="both", expand=True)

            # Top Header Bar
            header = ctk.CTkFrame(dash_frame, fg_color="#064E3B", height=60, corner_radius=0)
            header.pack(fill="x", side="top")

            header_title = ctk.CTkLabel(
                header,
                text="🎓 Advance Online Learning Portal - Dashboard",
                font=("Arial", 18, "bold"),
                text_color="white"
            )
            header_title.pack(side="left", padx=20, pady=15)

            user_badge = ctk.CTkLabel(
                header,
                text=f"User: {username}",
                font=("Arial", 13, "bold"),
                text_color="#D1FAE5"
            )
            user_badge.pack(side="right", padx=(0, 15), pady=15)

            logout_btn = ctk.CTkButton(
                header,
                text="Logout",
                width=80,
                height=30,
                command=self.build_login_screen,
                fg_color="#EF4444",
                hover_color="#DC2626"
            )
            logout_btn.pack(side="right", padx=10, pady=15)

            # Tabview Navigation
            tabview = ctk.CTkTabview(dash_frame, corner_radius=10)
            tabview.pack(fill="both", expand=True, padx=15, pady=15)

            tab_students = tabview.add("Students Directory")
            tab_add = tabview.add("Add New Student")
            tab_analytics = tabview.add("Analytics & Reports")

            # --- TAB 1: STUDENTS DIRECTORY ---
            self._build_students_tab(tab_students)

            # --- TAB 2: ADD STUDENT ---
            self._build_add_student_tab(tab_add, tabview)

            # --- TAB 3: ANALYTICS ---
            self._build_analytics_tab(tab_analytics)

        else:
            # Fallback Dashboard
            frame = tk.Frame(self.root, padx=20, pady=20)
            frame.pack(fill="both", expand=True)

            tk.Label(frame, text=f"Welcome {username} to Student Dashboard", font=("Arial", 16, "bold")).pack(pady=10)
            tk.Button(frame, text="Logout", command=self.build_login_screen).pack(anchor="e")

    def _build_students_tab(self, parent):
        # Search Bar
        search_frame = ctk.CTkFrame(parent, fg_color="transparent")
        search_frame.pack(fill="x", pady=(5, 10))

        search_label = ctk.CTkLabel(search_frame, text="Search Student:", font=("Arial", 13, "bold"))
        search_label.pack(side="left", padx=(5, 10))

        self.search_entry = ctk.CTkEntry(search_frame, placeholder_text="Type Name, Roll No, or Course...", width=300)
        self.search_entry.pack(side="left", padx=5)

        search_btn = ctk.CTkButton(
            search_frame,
            text="Search",
            width=90,
            command=self.refresh_student_table,
            fg_color="#059669"
        )
        search_btn.pack(side="left", padx=5)

        reset_btn = ctk.CTkButton(
            search_frame,
            text="Reset",
            width=80,
            command=self.reset_search,
            fg_color="#6B7280"
        )
        reset_btn.pack(side="left", padx=5)

        # Table Container using Tkinter Treeview for crisp tabular display
        table_frame = ctk.CTkFrame(parent)
        table_frame.pack(fill="both", expand=True, pady=5)

        columns = ("roll_no", "name", "course", "grade")
        self.tree = ttk.Treeview(table_frame, columns=columns, show="headings", height=12)

        self.tree.heading("roll_no", text="Roll No")
        self.tree.heading("name", text="Student Name")
        self.tree.heading("course", text="Course / Subject")
        self.tree.heading("grade", text="Grade (%)")

        self.tree.column("roll_no", width=100, anchor="center")
        self.tree.column("name", width=250, anchor="w")
        self.tree.column("course", width=250, anchor="w")
        self.tree.column("grade", width=120, anchor="center")

        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)

        self.tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Action bar under table
        action_frame = ctk.CTkFrame(parent, fg_color="transparent")
        action_frame.pack(fill="x", pady=10)

        remove_btn = ctk.CTkButton(
            action_frame,
            text="Delete Selected Student",
            command=self.handle_remove_selected,
            fg_color="#EF4444",
            hover_color="#B91C1C"
        )
        remove_btn.pack(side="right", padx=5)

        self.refresh_student_table()

    def _build_add_student_tab(self, parent, tabview):
        form_frame = ctk.CTkFrame(parent, fg_color="white", corner_radius=10)
        form_frame.pack(fill="both", expand=True, padx=40, pady=20)

        title = ctk.CTkLabel(form_frame, text="Register New Student", font=("Arial", 18, "bold"), text_color="#064E3B")
        title.pack(pady=15)

        # Roll Number
        ctk.CTkLabel(form_frame, text="Roll Number:", font=("Arial", 13, "bold")).pack(anchor="w", padx=60, pady=(5, 2))
        self.add_roll_entry = ctk.CTkEntry(form_frame, width=350, placeholder_text="e.g. 106")
        self.add_roll_entry.pack(pady=(0, 10))

        # Full Name
        ctk.CTkLabel(form_frame, text="Full Name:", font=("Arial", 13, "bold")).pack(anchor="w", padx=60, pady=(5, 2))
        self.add_name_entry = ctk.CTkEntry(form_frame, width=350, placeholder_text="e.g. Sarah Jenkins")
        self.add_name_entry.pack(pady=(0, 10))

        # Course
        ctk.CTkLabel(form_frame, text="Course / Specialization:", font=("Arial", 13, "bold")).pack(anchor="w", padx=60, pady=(5, 2))
        self.add_course_option = ctk.CTkOptionMenu(
            form_frame,
            width=350,
            values=["Computer Science", "Data Science", "AI & Machine Learning", "Cybersecurity", "Software Engineering"]
        )
        self.add_course_option.pack(pady=(0, 10))

        # Grade
        ctk.CTkLabel(form_frame, text="Initial Grade (0 - 100):", font=("Arial", 13, "bold")).pack(anchor="w", padx=60, pady=(5, 2))
        self.add_grade_entry = ctk.CTkEntry(form_frame, width=350, placeholder_text="e.g. 88.5")
        self.add_grade_entry.pack(pady=(0, 20))

        submit_btn = ctk.CTkButton(
            form_frame,
            text="Save Student Record",
            width=250,
            height=40,
            command=lambda: self.handle_add_student(tabview),
            fg_color="#059669",
            hover_color="#047857",
            font=("Arial", 14, "bold")
        )
        submit_btn.pack(pady=10)

    def _build_analytics_tab(self, parent):
        self.analytics_frame = ctk.CTkFrame(parent, fg_color="transparent")
        self.analytics_frame.pack(fill="both", expand=True, padx=20, pady=20)
        self.refresh_analytics()

    def refresh_analytics(self):
        for widget in self.analytics_frame.winfo_children():
            widget.destroy()

        stats = self.student_mgr.get_analytics()

        # Grid layout for stat cards
        cards = [
            ("Total Students", f"{stats['total_students']}", "#3B82F6"),
            ("Class Average Grade", f"{stats['average_grade']}%", "#10B981"),
            ("Highest Grade", f"{stats['highest_grade']}%", "#F59E0B"),
            ("Pass Rate (>= 50%)", f"{stats['pass_rate']}%", "#8B5CF6")
        ]

        for i, (label, val, color) in enumerate(cards):
            row = i // 2
            col = i % 2

            card = ctk.CTkFrame(self.analytics_frame, fg_color=color, corner_radius=12)
            card.grid(row=row, column=col, padx=15, pady=15, sticky="nsew")
            self.analytics_frame.grid_columnconfigure(col, weight=1)
            self.analytics_frame.grid_rowconfigure(row, weight=1)

            ctk.CTkLabel(card, text=label, font=("Arial", 16, "bold"), text_color="white").pack(pady=(25, 5))
            ctk.CTkLabel(card, text=val, font=("Arial", 28, "bold"), text_color="white").pack(pady=(0, 25))

    def refresh_student_table(self):
        query = self.search_entry.get() if hasattr(self, "search_entry") else ""
        students = self.student_mgr.search_students(query)

        # Clear tree
        for item in self.tree.get_children():
            self.tree.delete(item)

        for s in students:
            self.tree.insert("", "end", values=(s.roll_no, s.name, s.course, f"{s.grade:.1f}"))

    def reset_search(self):
        self.search_entry.delete(0, "end")
        self.refresh_student_table()

    def handle_add_student(self, tabview):
        roll = self.add_roll_entry.get().strip()
        name = self.add_name_entry.get().strip()
        course = self.add_course_option.get()

        try:
            grade = float(self.add_grade_entry.get().strip())
        except ValueError:
            show_error("Validation Error", "Grade must be a valid number.", parent=self.root)
            return

        success, msg = self.student_mgr.add_student(name, roll, grade, course)
        if success:
            show_info("Success", msg, parent=self.root)
            self.add_roll_entry.delete(0, "end")
            self.add_name_entry.delete(0, "end")
            self.add_grade_entry.delete(0, "end")
            self.refresh_student_table()
            self.refresh_analytics()
            tabview.set("Students Directory")
        else:
            show_error("Error", msg, parent=self.root)

    def handle_remove_selected(self):
        selected_item = self.tree.selection()
        if not selected_item:
            show_error("Selection Error", "Please select a student from the table to delete.", parent=self.root)
            return

        item_values = self.tree.item(selected_item[0], "values")
        roll_no = item_values[0]

        success, msg = self.student_mgr.remove_student(roll_no)
        if success:
            show_info("Deleted", msg, parent=self.root)
            self.refresh_student_table()
            self.refresh_analytics()
        else:
            show_error("Error", msg, parent=self.root)

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = AdvanceLearningApp()
    app.run()