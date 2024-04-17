from celery import shared_task 
from .models import Product, OrderProduct
import csv
import datetime
import time

@shared_task(ignore_result = False, name = 'display')
def display():
    return "understanding celery"

@shared_task(ignore_result = False, name = 'export')
def export_csv():
    time.sleep(3)
    csv_file_name = "product_csv_" + datetime.datetime.now().strftime('%f')+".csv"
    all_products = Product.query.all()
    with open(f'static/{csv_file_name}', 'w', newline='') as csvfile:
        sr_no = 1
        products_csv = csv.writer(csvfile, delimiter=',')
        products_csv.writerow(['Sr No', 'Product Name', 'Units Available', 'Units Sold', 'Unit Price', 'Earnings'])
        for product in all_products:
            orders = OrderProduct.query.filter_by(prod_id = product.id).all()
            sold = 0
            for order in orders:
                sold += order.quantity
            earnings = sold*product.price
            this_prod = [sr_no, product.p_name, product.quantity, sold, product.price, earnings]
            products_csv.writerow(this_prod)
            sr_no += 1
    return csv_file_name