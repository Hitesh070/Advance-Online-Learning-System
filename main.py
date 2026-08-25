import sys
from front_end import AdvanceLearningApp
from practice import main as run_cli

def main():
    """Main Entry Point for Advance Online Learning System."""
    if len(sys.argv) > 1 and sys.argv[1].lower() in ["--cli", "-c"]:
        print("Starting Advance Online Learning System (CLI Mode)...")
        run_cli()
    else:
        print("Starting Advance Online Learning System (GUI Mode)...")
        app = AdvanceLearningApp()
        app.run()

if __name__ == "__main__":
    main()