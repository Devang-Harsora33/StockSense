import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:money_formatter/money_formatter.dart';
import 'package:stocksense_app/main.dart';
import 'package:stocksense_app/screens/addproduct/addproduct.dart';
import 'package:stocksense_app/screens/product/myproducts.dart';
import 'package:stocksense_app/screens/widget/bottomnavbar.dart';
import 'package:stocksense_app/screens/widget/floatingactionbutton.dart';

import '../../constants/colors.dart';
import '../initial/splashscreen.dart';
import '../product/productinfo.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getStats();
  }

  var total_products = 0;
  var total_investment = 0;
  var total_profit = 0;

  var total_products_str = "0";
  var total_investment_str = "0";
  var total_profit_str = "0";

  Future getStats() async {
    await FirebaseFirestore.instance
        .collection("users")
        .doc(FirebaseAuth.instance.currentUser!.uid)
        .collection("products")
        .get()
        .then((value) {
      total_products = value.docs.length;
    });

    await FirebaseFirestore.instance
        .collection("users")
        .doc(FirebaseAuth.instance.currentUser!.uid)
        .collection("products")
        .get()
        .then((value) {
      for (var i = 0; i < value.docs.length; i++) {
        total_investment += int.parse(value.docs[i]
            .data()['amount_invested']
            .toString()
            .split(",")
            .join()
            .toString());
      }
    });

    await FirebaseFirestore.instance
        .collection("users")
        .doc(FirebaseAuth.instance.currentUser!.uid)
        .collection("products")
        .get()
        .then((value) {
      for (var i = 0; i < value.docs.length; i++) {
        total_profit += int.parse(value.docs[i]
            .data()['total_profit']
            .toString()
            .split(",")
            .join()
            .toString());
      }
    });

    setState(() {
      total_investment_str =
          MoneyFormatter(amount: double.parse(total_investment.toString()))
              .output
              .withoutFractionDigits;
      total_profit_str =
          MoneyFormatter(amount: double.parse(total_profit.toString()))
              .output
              .withoutFractionDigits;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: Colors.white,
          scrolledUnderElevation: 0.0,
          toolbarHeight: 100,
          title: Padding(
            padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "StockSense",
                          style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: primaryColor,
                              fontSize: 24),
                        ),
                        Text(
                          FirebaseAuth.instance.currentUser!.displayName != null
                              ? "Hey, ${FirebaseAuth.instance.currentUser!.displayName} "
                              : "Hey, User",
                          style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                              fontSize: 16),
                        ),
                      ],
                    ),
                    Container(
                      width: 47,
                      height: 47,
                      decoration: BoxDecoration(
                          color: thirdColor,
                          borderRadius: BorderRadius.circular(15)),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          InkWell(
                              onTap: () async {
                                await FirebaseAuth.instance.signOut();
                                Get.offAll(const SplashScreen(),
                                    transition: Transition.circularReveal);
                              },
                              child: const Icon(Icons.logout_outlined)),
                        ],
                      ),
                    ),
                  ],
                ),
                Divider(
                  color: Colors.grey.shade300,
                )
              ],
            ),
          )),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(25, 0, 0, 20),
            child: const Text(
              'Stats at Glance',
              style:
                  TextStyle(color: secondaryColor, fontWeight: FontWeight.w600),
            ),
          ),
          Row(
            children: [
              Expanded(
                child: Container(
                    margin: const EdgeInsets.fromLTRB(25, 0, 5, 0),
                    height: 180,
                    decoration: BoxDecoration(
                        color: primaryColor,
                        borderRadius: BorderRadius.circular(20)),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.payments_outlined,
                          color: Colors.white,
                          size: 40,
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        const Text(
                          "Total Investment",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Text(
                          total_investment_str.toString(),
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.w600),
                        )
                      ],
                    )),
              ),
              Expanded(
                child: Container(
                    margin: const EdgeInsets.fromLTRB(5, 0, 25, 0),
                    height: 180,
                    decoration: BoxDecoration(
                        color: primaryColor,
                        borderRadius: BorderRadius.circular(20)),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.savings_outlined,
                          color: Colors.white,
                          size: 40,
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        const Text(
                          "Total Profit",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Text(
                          total_profit_str.toString(),
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.w600),
                        )
                      ],
                    )),
              )
            ],
          ),
          Container(
              margin: const EdgeInsets.fromLTRB(25, 10, 25, 10),
              height: 100,
              width: double.infinity,
              decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(20)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Icon(
                    Icons.shopping_bag_outlined,
                    color: Colors.black,
                    size: 40,
                  ),
                  const Text(
                    "Total Products",
                    style: TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                        fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  Text(
                    total_products.toString(),
                    style: TextStyle(
                        color: Colors.black,
                        fontSize: 24,
                        fontWeight: FontWeight.w600),
                  )
                ],
              )),
          Padding(
            padding: const EdgeInsets.fromLTRB(25, 20, 0, 20),
            child: const Text(
              'Recent Inventory Additions',
              style:
                  TextStyle(color: secondaryColor, fontWeight: FontWeight.w600),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(25, 0, 25, 0),
            child: SizedBox(
              height: 120,
              child: StreamBuilder(
                stream: FirebaseFirestore.instance
                    .collection('users')
                    .doc(FirebaseAuth.instance.currentUser!.uid)
                    .collection(DateFormat('MMMM yyyy').format(DateTime.now()))
                    .snapshots(),
                builder: (context, snapshot) {
                  if (!snapshot.hasData) {
                    return const SizedBox(
                      height: 160,
                      child: Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                  } else if (snapshot.data!.docs.isEmpty) {
                    return const SizedBox(
                      height: 160,
                      child: Center(
                        child: Text("No Inventory Found for given month"),
                      ),
                    );
                  } else {
                    return PageView.builder(
                        itemCount: snapshot.data!.docs.length,
                        scrollDirection: Axis.horizontal,
                        itemBuilder: (context, index) {
                          DocumentSnapshot documentSnapshot =
                              snapshot.data!.docs[index];
                          return Card(
                            product_name: documentSnapshot['product_name'],
                            product_description:
                                documentSnapshot['product_description'],
                            product_rate: documentSnapshot['product_rate'],
                            product_profit: documentSnapshot['product_profit'],
                            product_id: documentSnapshot['product_id'],
                            product_image: documentSnapshot['product_image'],
                            quantity_sold: documentSnapshot['quantity_sold'],
                            total_quantity: documentSnapshot['total_quantity'],
                            id: documentSnapshot.id,
                          );
                        });
                  }
                },
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(25, 20, 0, 5),
            child: const Text(
              'Add a New Product',
              style:
                  TextStyle(color: secondaryColor, fontWeight: FontWeight.w600),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(25, 0, 25, 20),
            child: Text(
              'Easily add a new product to your inventory by storing it.',
              style: TextStyle(
                  color: Colors.grey.shade400,
                  fontWeight: FontWeight.w600,
                  fontSize: 12),
            ),
          ),
          InkWell(
            onTap: () => Get.to(() => const AddProduct(),
                transition: Transition.rightToLeft),
            child: Container(
              margin: const EdgeInsets.fromLTRB(25, 10, 25, 0),
              height: 60,
              padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
              width: double.infinity,
              decoration: BoxDecoration(
                  color: primaryColor, borderRadius: BorderRadius.circular(10)),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Scan Barcode Data',
                    style: TextStyle(
                      fontWeight: FontWeight.w300,
                      fontSize: 15,
                      color: Colors.white,
                    ),
                  ),
                  Icon(Icons.barcode_reader, color: Colors.white),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: Floatingactionbutton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: Bottomnavbar(0),
    );
  }
}

Widget Card(
    {product_name,
    product_description,
    product_rate,
    product_profit,
    product_id,
    product_image,
    quantity_sold,
    total_quantity,
    id}) {
  var sale_ratio = (int.parse(quantity_sold) / int.parse(total_quantity));
  return GestureDetector(
    onTap: () => Get.to(
      () => Productinfo(product_id),
    ),
    child: Container(
        padding: const EdgeInsets.all(10),
        margin: const EdgeInsets.only(bottom: 10),
        height: 110,
        decoration: BoxDecoration(
            color: sale_ratio >= 0.5
                ? Colors.green.shade50
                : sale_ratio <= 0.5 && sale_ratio > 0
                    ? Colors.red.shade50
                    : Colors.grey.shade50,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade100)),
        child: Row(
          children: [
            Container(
              margin: const EdgeInsets.only(right: 10),
              height: 100,
              width: 90,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.shade100),
                  image: DecorationImage(
                      image: NetworkImage(product_image), fit: BoxFit.cover)),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          product_name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              color: primaryColor,
                              fontWeight: FontWeight.w600,
                              fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          color: Colors.grey.shade200,
                          height: 1,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            const Icon(
                              Icons.inventory_2_outlined,
                              size: 16,
                              color: secondaryColor,
                            ),
                            const SizedBox(
                              width: 5,
                            ),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("Product Rate",
                                      style: TextStyle(
                                          color: secondaryColor,
                                          fontWeight: FontWeight.w400,
                                          fontSize: 8)),
                                  Row(
                                    children: [
                                      Expanded(
                                        flex: 3,
                                        child: Text(
                                          "₹ " + product_rate,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                              color: secondaryColor,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 14),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Row(
                          children: [
                            const Icon(
                              Icons.money,
                              size: 16,
                              color: secondaryColor,
                            ),
                            const SizedBox(
                              width: 5,
                            ),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("Net Profit",
                                      style: TextStyle(
                                          color: secondaryColor,
                                          fontWeight: FontWeight.w400,
                                          fontSize: 8)),
                                  Row(
                                    children: [
                                      Expanded(
                                        flex: 3,
                                        child: Text(
                                          "₹ " + product_profit,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                              color: secondaryColor,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 14),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                product_description,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                    color: secondaryColor,
                                    fontWeight: FontWeight.w400,
                                    fontSize: 11),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 0, 0, 0),
              child: InkWell(
                onTap: () async {
                  try {
                    if (int.parse(quantity_sold) == int.parse(total_quantity)) {
                      Get.snackbar(
                        "Error",
                        "Product Quantity is already sold out",
                      );
                      return;
                    }
                    var total_profit;
                    await FirebaseFirestore.instance
                        .collection("users")
                        .doc(FirebaseAuth.instance.currentUser!.uid)
                        .collection('products')
                        .doc(product_id)
                        .get()
                        .then(
                            (value) => {total_profit = value['total_profit']});
                    var profit_to_add = (int.parse(total_profit
                            .toString()
                            .split(",")
                            .join()
                            .toString()) +
                        int.parse(product_profit
                            .toString()
                            .split(",")
                            .join()
                            .toString()));

                    await FirebaseFirestore.instance
                        .collection("users")
                        .doc(FirebaseAuth.instance.currentUser!.uid)
                        .collection(DateFormat('MMMM yyyy')
                            .format(DateTime.now())
                            .toString())
                        .doc(id)
                        .update({
                      'quantity_sold':
                          (int.parse(quantity_sold) + 1).toString(),
                    });

                    await FirebaseFirestore.instance
                        .collection("users")
                        .doc(FirebaseAuth.instance.currentUser!.uid)
                        .collection('products')
                        .doc(product_id)
                        .update({
                      'total_profit': MoneyFormatter(
                              amount: double.parse(profit_to_add.toString()))
                          .output
                          .withoutFractionDigits,
                    });

                    Get.snackbar(
                      "Success",
                      "Product Quantity Modified",
                    );
                  } on FirebaseException catch (e) {
                    Get.snackbar(
                      "Error",
                      e.message.toString(),
                    );
                  }
                },
                child: Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                      decoration: BoxDecoration(
                          color: primaryColor,
                          borderRadius: BorderRadius.circular(12)),
                      child: Column(
                        children: [
                          Expanded(
                            child: SizedBox(
                              height: 5,
                            ),
                          ),
                          Expanded(
                            flex: 3,
                            child: Text(quantity_sold,
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 16)),
                          ),
                          Divider(
                            height: 1,
                            color: Colors.white,
                          ),
                          Container(
                            decoration: BoxDecoration(
                                color: Colors.grey.shade300,
                                borderRadius: BorderRadius.only(
                                    bottomLeft: Radius.circular(10),
                                    bottomRight: Radius.circular(10))),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Expanded(
                                  child: Text(total_quantity,
                                      textAlign: TextAlign.center,
                                      style: const TextStyle(
                                          color: secondaryColor,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 10)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      margin: EdgeInsets.fromLTRB(0, 0, 0, 0),
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                          border:
                              Border.all(color: Colors.grey.shade200, width: 1),
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(7)),
                      child: Icon(Icons.add, color: secondaryColor, size: 15),
                    ),
                  ],
                ),
              ),
            ),
          ],
        )),
  );
}
