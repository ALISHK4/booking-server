import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import pyodbc

DB_PATH = r"C:\Users\sylei\Desktop\ДГУНХ\Работа с БД в визуальных средах\Автосалон.mdb"

class AutoSalonApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Автосалон")
        self.geometry("1200x750")

        # Подключение к Access через ODBC
        try:
            self.conn = pyodbc.connect(
                r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=' + DB_PATH + ';')
        except Exception as e:
            messagebox.showerror("Ошибка подключения", str(e))
            self.destroy()
            return

        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill=tk.BOTH, expand=True)

        # Создаем вкладки
        self.create_cars_tab()
        self.create_clients_tab()
        self.create_sales_tab()

    def create_top_panel(self, parent, search_callback):
        frame = tk.Frame(parent)
        frame.pack(fill=tk.X, padx=5, pady=5)

        btn_add = tk.Button(frame, text="➕ Добавить")
        btn_edit = tk.Button(frame, text="✏ Редактировать")
        btn_delete = tk.Button(frame, text="🗑 Удалить")
        btn_refresh = tk.Button(frame, text="🔄 Обновить")

        btn_add.pack(side=tk.LEFT, padx=5)
        btn_edit.pack(side=tk.LEFT, padx=5)
        btn_delete.pack(side=tk.LEFT, padx=5)
        btn_refresh.pack(side=tk.LEFT, padx=5)

        search_var = tk.StringVar()
        search_entry = tk.Entry(frame, textvariable=search_var)
        search_entry.pack(side=tk.RIGHT, padx=5)
        search_entry.bind("<KeyRelease>", lambda e: search_callback(search_var.get()))

        search_btn = tk.Button(frame, text="🔍", command=lambda: search_callback(search_var.get()))
        search_btn.pack(side=tk.RIGHT)

        return btn_add, btn_edit, btn_delete, btn_refresh

    def create_treeview(self, parent, columns):
        tree = ttk.Treeview(parent, columns=columns, show="headings")
        tree.pack(fill=tk.BOTH, expand=True)
        for col in columns:
            tree.heading(col, text=col)
            tree.column(col, width=100)
        return tree

    # -------------------- Cars Tab --------------------
    def create_cars_tab(self):
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="🚗 Автомобили")

        self.cars_tree = self.create_treeview(tab, ["ID", "Brend", "Model", "Year", "Color", "Price", "Vin", "Availability"])
        btn_add, btn_edit, btn_delete, btn_refresh = self.create_top_panel(tab, self.search_cars)

        btn_add.config(command=self.add_car)
        btn_edit.config(command=self.edit_car)
        btn_delete.config(command=self.delete_car)
        btn_refresh.config(command=self.load_cars)

        self.load_cars()

    def load_cars(self):
        self.cars_tree.delete(*self.cars_tree.get_children())
        cursor = self.conn.cursor()
        cursor.execute("SELECT ID_Car, Brend, Model, [Year], Color, Price, Vin, Availability FROM Cars")
        for row in cursor.fetchall():
            self.cars_tree.insert("", tk.END, values=row)

    def search_cars(self, term):
        self.cars_tree.delete(*self.cars_tree.get_children())
        cursor = self.conn.cursor()
        sql = f"""SELECT ID_Car, Brend, Model, [Year], Color, Price, Vin, Availability
                  FROM Cars
                  WHERE Brend LIKE ? OR Model LIKE ? OR Color LIKE ? OR Vin LIKE ?"""
        term = f"%{term}%"
        cursor.execute(sql, (term, term, term, term))
        for row in cursor.fetchall():
            self.cars_tree.insert("", tk.END, values=row)

    def add_car(self):
        try:
            brend = simpledialog.askstring("Добавление автомобиля", "Марка (Brend):")
            if not brend: return
            model = simpledialog.askstring("Добавление автомобиля", "Модель (Model):")
            year = simpledialog.askinteger("Добавление автомобиля", "Год выпуска (Year):")
            color = simpledialog.askstring("Добавление автомобиля", "Цвет (Color):")
            vin = simpledialog.askstring("Добавление автомобиля", "VIN (Vin):")
            price = simpledialog.askfloat("Добавление автомобиля", "Цена автомобиля:")

            cursor = self.conn.cursor()
            cursor.execute("INSERT INTO Cars (Brend, Model, [Year], Color, Price, Vin, Availability) VALUES (?, ?, ?, ?, ?, ?, True)",
                           (brend, model, year, color, price, vin))
            self.conn.commit()
            messagebox.showinfo("Успех", "Автомобиль добавлен!")
            self.load_cars()
        except Exception as e:
            messagebox.showerror("Ошибка", str(e))

    def edit_car(self):
        selected = self.cars_tree.selection()
        if not selected: return
        item = self.cars_tree.item(selected[0])
        car_id = item['values'][0]
        new_color = simpledialog.askstring("Редактирование автомобиля", "Новый цвет:", initialvalue=item['values'][4])
        if not new_color: return
        cursor = self.conn.cursor()
        cursor.execute("UPDATE Cars SET Color=? WHERE ID_Car=?", (new_color, car_id))
        self.conn.commit()
        self.load_cars()

    def delete_car(self):
        selected = self.cars_tree.selection()
        if not selected: return
        item = self.cars_tree.item(selected[0])
        car_id = item['values'][0]
        if messagebox.askyesno("Подтверждение", f"Удалить автомобиль ID={car_id}?"):
            cursor = self.conn.cursor()
            cursor.execute("DELETE FROM Cars WHERE ID_Car=?", (car_id,))
            self.conn.commit()
            self.load_cars()

    # -------------------- Clients Tab --------------------
    def create_clients_tab(self):
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="👤 Клиенты")

        self.clients_tree = self.create_treeview(tab, ["ID", "FirstName", "LastName", "Phone", "Email", "Passport", "Address"])
        btn_add, btn_edit, btn_delete, btn_refresh = self.create_top_panel(tab, self.search_clients)

        btn_add.config(command=self.add_client)
        btn_edit.config(command=self.edit_client)
        btn_delete.config(command=self.delete_client)
        btn_refresh.config(command=self.load_clients)

        self.load_clients()

    def load_clients(self):
        self.clients_tree.delete(*self.clients_tree.get_children())
        cursor = self.conn.cursor()
        cursor.execute("SELECT ID_Client, FirstName, LastName, Phone, Email, PassportNumber, Address FROM Clients")
        for row in cursor.fetchall():
            self.clients_tree.insert("", tk.END, values=row)

    def search_clients(self, term):
        self.clients_tree.delete(*self.clients_tree.get_children())
        cursor = self.conn.cursor()
        sql = """SELECT ID_Client, FirstName, LastName, Phone, Email, PassportNumber, Address
                 FROM Clients
                 WHERE FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?"""
        term = f"%{term}%"
        cursor.execute(sql, (term, term, term, term))
        for row in cursor.fetchall():
            self.clients_tree.insert("", tk.END, values=row)

    def add_client(self):
        try:
            first = simpledialog.askstring("Добавление клиента", "Имя:")
            last = simpledialog.askstring("Добавление клиента", "Фамилия:")
            phone = simpledialog.askstring("Добавление клиента", "Телефон:")
            email = simpledialog.askstring("Добавление клиента", "Email:")
            passport = simpledialog.askstring("Добавление клиента", "PassportNumber:")
            address = simpledialog.askstring("Добавление клиента", "Address:")

            cursor = self.conn.cursor()
            cursor.execute("INSERT INTO Clients (FirstName, LastName, Phone, Email, PassportNumber, Address) VALUES (?, ?, ?, ?, ?, ?)",
                           (first, last, phone, email, passport, address))
            self.conn.commit()
            messagebox.showinfo("Успех", "Клиент добавлен!")
            self.load_clients()
        except Exception as e:
            messagebox.showerror("Ошибка", str(e))

    def edit_client(self):
        selected = self.clients_tree.selection()
        if not selected: return
        item = self.clients_tree.item(selected[0])
        client_id = item['values'][0]
        new_phone = simpledialog.askstring("Редактирование клиента", "Новый телефон:", initialvalue=item['values'][3])
        if not new_phone: return
        cursor = self.conn.cursor()
        cursor.execute("UPDATE Clients SET Phone=? WHERE ID_Client=?", (new_phone, client_id))
        self.conn.commit()
        self.load_clients()

    def delete_client(self):
        selected = self.clients_tree.selection()
        if not selected: return
        item = self.clients_tree.item(selected[0])
        client_id = item['values'][0]
        if messagebox.askyesno("Подтверждение", f"Удалить клиента ID={client_id}?"):
            cursor = self.conn.cursor()
            cursor.execute("DELETE FROM Clients WHERE ID_Client=?", (client_id,))
            self.conn.commit()
            self.load_clients()

    # -------------------- Sales Tab --------------------
    def create_sales_tab(self):
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="💰 Продажи")

        self.sales_tree = self.create_treeview(tab, ["ID", "Model", "LastName", "SaleDate", "SalePrice", "Manager"])
        btn_add, btn_edit, btn_delete, btn_refresh = self.create_top_panel(tab, self.search_sales)

        btn_add.config(command=self.add_sale)
        btn_edit.config(command=self.edit_sale)
        btn_delete.config(command=self.delete_sale)
        btn_refresh.config(command=self.load_sales)

        self.load_sales()

    def load_sales(self):
        self.sales_tree.delete(*self.sales_tree.get_children())
        cursor = self.conn.cursor()
        sql = """SELECT S.ID_Sale AS ID, C.Model AS Model, CL.LastName AS LastName, 
                        S.SaleDate, S.SalePrice, S.Manager
                 FROM (Sales S INNER JOIN Cars C ON S.ID_Car = C.ID_Car)
                 INNER JOIN Clients CL ON S.ID_Client = CL.ID_Client"""
        cursor.execute(sql)
        for row in cursor.fetchall():
            self.sales_tree.insert("", tk.END, values=row)

    def search_sales(self, term):
        self.sales_tree.delete(*self.sales_tree.get_children())
        cursor = self.conn.cursor()
        sql = """SELECT S.ID_Sale AS ID, C.Model AS Model, CL.LastName AS LastName, 
                        S.SaleDate, S.SalePrice, S.Manager
                 FROM (Sales S INNER JOIN Cars C ON S.ID_Car = C.ID_Car)
                 INNER JOIN Clients CL ON S.ID_Client = CL.ID_Client
                 WHERE C.Model LIKE ? OR CL.LastName LIKE ? OR S.Manager LIKE ?"""
        term = f"%{term}%"
        cursor.execute(sql, (term, term, term))
        for row in cursor.fetchall():
            self.sales_tree.insert("", tk.END, values=row)

    def add_sale(self):
        try:
            car_id = simpledialog.askinteger("Добавление продажи", "ID_Car:")
            client_id = simpledialog.askinteger("Добавление продажи", "ID_Client:")
            sale_date = simpledialog.askstring("Добавление продажи", "Дата продажи (YYYY-MM-DD):")
            sale_price = simpledialog.askfloat("Добавление продажи", "Цена продажи:")
            manager = simpledialog.askstring("Добавление продажи", "Менеджер:")

            cursor = self.conn.cursor()
            cursor.execute("INSERT INTO Sales (ID_Car, ID_Client, SaleDate, SalePrice, Manager) VALUES (?, ?, ?, ?, ?)",
                           (car_id, client_id, sale_date, sale_price, manager))
            self.conn.commit()
            messagebox.showinfo("Успех", "Продажа добавлена!")
            self.load_sales()
        except Exception as e:
            messagebox.showerror("Ошибка", str(e))

    def edit_sale(self):
        selected = self.sales_tree.selection()
        if not selected: return
        item = self.sales_tree.item(selected[0])
        sale_id = item['values'][0]
        new_manager = simpledialog.askstring("Редактирование продажи", "Новый менеджер:", initialvalue=item['values'][5])
        if not new_manager: return
        cursor = self.conn.cursor()
        cursor.execute("UPDATE Sales SET Manager=? WHERE ID_Sale=?", (new_manager, sale_id))
        self.conn.commit()
        self.load_sales()

    def delete_sale(self):
        selected = self.sales_tree.selection()
        if not selected: return
        item = self.sales_tree.item(selected[0])
        sale_id = item['values'][0]
        if messagebox.askyesno("Подтверждение", f"Удалить продажу ID={sale_id}?"):
            cursor = self.conn.cursor()
            cursor.execute("DELETE FROM Sales WHERE ID_Sale=?", (sale_id,))
            self.conn.commit()
            self.load_sales()


if __name__ == "__main__":
    app = AutoSalonApp()
    app.mainloop()
