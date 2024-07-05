from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'
        indexes = [
            models.Index(fields=['name']),
        ]


class Product(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', blank=True)
    documentation = models.ManyToManyField('Documentation', related_name='products', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['price']),
        ]

    def latest_documentation(self):
        return self.documentation.order_by('-uploaded_at').first()


class Documentation(models.Model):
    file = models.FileField(upload_to='documentation/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Documentation uploaded on {self.uploaded_at}"
