import csv
import chardet
from django.core.management.base import BaseCommand
from prod.models import Category, Product
from django.core.files import File
from django.conf import settings
import os


class Command(BaseCommand):
    help = 'Import products and categories from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')
        parser.add_argument('--encoding', type=str, help='File encoding (optional)', default=None)

    def detect_encoding(self, file_path):
        with open(file_path, 'rb') as file:
            raw_data = file.read()
            result = chardet.detect(raw_data)
        return result['encoding']

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']
        encoding = options['encoding']

        if not encoding:
            encoding = self.detect_encoding(csv_file_path)
            self.stdout.write(self.style.SUCCESS(f'Detected file encoding: {encoding}'))

        try:
            with open(csv_file_path, 'r', encoding=encoding) as file:
                csv_reader = csv.DictReader(file)
                for row in csv_reader:
                    # Создаем или получаем категорию
                    category, _ = Category.objects.get_or_create(name=row['category'])

                    # Создаем продукт
                    product = Product(
                        name=row['name'],
                        description=row['description'],
                        price=float(row['price']),
                        category=category
                    )

                    # Обрабатываем изображение, если оно указано
                    if 'image' in row and row['image']:
                        image_path = os.path.join(settings.IMPORT_IMAGES_DIR, row['image'])
                        if os.path.exists(image_path):
                            with open(image_path, 'rb') as img_file:
                                product.image.save(row['image'], File(img_file), save=False)

                    product.save()

            self.stdout.write(self.style.SUCCESS('Successfully imported data'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error occurred: {str(e)}'))
