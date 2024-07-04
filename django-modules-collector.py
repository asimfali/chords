import os
import fnmatch


def load_ignore_patterns(ignore_file='.collectignore'):
    if not os.path.exists(ignore_file):
        return []
    with open(ignore_file, 'r') as f:
        return [line.strip() for line in f if line.strip() and not line.startswith('#')]


def should_ignore(path, ignore_patterns):
    for pattern in ignore_patterns:
        if fnmatch.fnmatch(path, pattern):
            return True
    return False


def collect_django_modules(start_path='.', ignore_file='.collectignore'):
    output_file = 'collected_django_modules.txt'
    allowed_extensions = ('.py', '.css', '.js', '.html', 'scss')
    ignore_patterns = load_ignore_patterns(ignore_file)

    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(start_path):
            # Remove ignored directories
            dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d), ignore_patterns)]

            for file in files:
                if file.endswith(allowed_extensions):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, start_path)

                    if should_ignore(relative_path, ignore_patterns):
                        continue

                    outfile.write(f'#{relative_path}\n')

                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except UnicodeDecodeError:
                        outfile.write(f"Error: Unable to read file {relative_path} due to encoding issues.\n")

                    outfile.write('\n\n')  # Add extra newline for separation

    print(f"All Django modules have been collected in {output_file}")


if __name__ == "__main__":
    collect_django_modules()
