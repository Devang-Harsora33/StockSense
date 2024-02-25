import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';
import 'package:intl/intl.dart';
import 'package:money_formatter/money_formatter.dart';

import '../../constants/colors.dart';
import '../home/home.dart';

class Productinfo extends StatefulWidget {
  var product_id;
  Productinfo(this.product_id, {Key? key}) : super(key: key);

  @override
  _ProductinfoState createState() => _ProductinfoState();
}

class _ProductinfoState extends State<Productinfo> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  var receivedData;

  Future fetchData() async {
    //fetch data from firebase
    await FirebaseFirestore.instance
        .collection("users")
        .doc(FirebaseAuth.instance.currentUser!.uid)
        .collection('products')
        .doc(widget.product_id)
        .get()
        .then((value) {
      setState(() {
        receivedData = value.data();
      });
    });
  }

  Future addToInventory() async {
    //add to inventory
    if (_quantity.text.isNotEmpty) {
      await FirebaseFirestore.instance
          .collection("users")
          .doc(FirebaseAuth.instance.currentUser!.uid)
          .collection(DateFormat('MMMM yyyy').format(DateTime.now()).toString())
          .doc()
          .set({
        "product_id": widget.product_id,
        "product_name": receivedData['product_name'],
        "product_image": receivedData['product_image'],
        "product_rate": receivedData['product_rate'],
        "product_profit": receivedData['product_profit'],
        "product_description": receivedData['product_description'],
        "product_barcodedata": receivedData['product_barcodedata'],
        "transportation_cost": receivedData['transportation_cost'],
        'created_time': DateTime.now(),
        "total_quantity": _quantity.text,
        'quantity_sold': '0',
        "total_profit": '0',
      }).then((value) async {
        var amount_invested = (int.parse(receivedData['amount_invested']
                    .toString()
                    .split(",")
                    .join()
                    .toString()) +
                (int.parse(receivedData['product_rate']
                        .toString()
                        .split(",")
                        .join()
                        .toString()) *
                    int.parse(_quantity.text)))
            .toString();
        await FirebaseFirestore.instance
            .collection("users")
            .doc(FirebaseAuth.instance.currentUser!.uid)
            .collection('products')
            .doc(widget.product_id)
            .update({
          'amount_invested':
              MoneyFormatter(amount: double.parse(amount_invested))
                  .output
                  .withoutFractionDigits,
        });

        Get.snackbar(
          "Success",
          "Product Added to Inventory",
        );
        Get.offAll(() => const Home(), transition: Transition.fadeIn);

        _quantity.clear();
      });
    } else {
      Get.snackbar(
        "Error",
        "Please Enter Quantity",
      );
    }
  }

  var _quantity = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
          backgroundColor: Colors.white,
          automaticallyImplyLeading: false,
          scrolledUnderElevation: 0.0,
          toolbarHeight: 100,
          title: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () {
                      Get.back();
                    },
                    child: Container(
                      width: 47,
                      height: 47,
                      decoration: BoxDecoration(
                          color: thirdColor,
                          borderRadius: BorderRadius.circular(15)),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.arrow_back_ios_new),
                        ],
                      ),
                    ),
                  ),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "StockSense",
                        style: TextStyle(
                            fontWeight: FontWeight.w500,
                            color: primaryColor,
                            fontSize: 24),
                      ),
                      Text(
                        "Product Details",
                        style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                            fontSize: 16),
                      ),
                    ],
                  ),
                  const SizedBox(
                    width: 47,
                  ),
                ],
              ),
            ],
          )),
      body: receivedData == null
          ? const Center(
              child: CircularProgressIndicator(
                color: primaryColor,
              ),
            )
          : Padding(
              padding: const EdgeInsets.fromLTRB(25, 0, 25, 0),
              child: SingleChildScrollView(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: const EdgeInsets.fromLTRB(0, 0, 0, 15),
                        height: 220,
                        padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                        width: double.infinity,
                        decoration: BoxDecoration(
                            image: DecorationImage(
                                image: NetworkImage(
                                    receivedData['product_image'].toString()),
                                fit: BoxFit.cover),
                            border: Border.all(
                              color: Colors.grey.shade200,
                            ),
                            borderRadius: BorderRadius.circular(10)),
                      ),
                      Text(
                        receivedData['product_name'],
                        style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w600,
                            color: primaryColor),
                      ),
                      Divider(
                        color: Colors.grey.shade200,
                      ),
                      Text(
                        receivedData['product_description'],
                        textAlign: TextAlign.justify,
                        overflow: TextOverflow.ellipsis,
                        maxLines: 5,
                        style: const TextStyle(
                            color: secondaryColor, fontSize: 14),
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              height: 50,
                              margin: const EdgeInsets.fromLTRB(0, 0, 2, 0),
                              padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
                              decoration: BoxDecoration(
                                  color: thirdColor,
                                  borderRadius: BorderRadius.circular(10)),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.inventory_2_outlined,
                                    size: 16,
                                    color: secondaryColor,
                                  ),
                                  const SizedBox(
                                    width: 10,
                                  ),
                                  Expanded(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text("Product Rate",
                                            style: TextStyle(
                                                color: secondaryColor,
                                                fontWeight: FontWeight.w400,
                                                fontSize: 10)),
                                        Row(
                                          children: [
                                            Expanded(
                                              flex: 3,
                                              child: Text(
                                                "₹ " +
                                                    receivedData[
                                                        'product_rate'],
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
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
                          ),
                          Expanded(
                            child: Container(
                              height: 50,
                              margin: const EdgeInsets.fromLTRB(2, 0, 0, 0),
                              padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
                              decoration: BoxDecoration(
                                  color: thirdColor,
                                  borderRadius: BorderRadius.circular(10)),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.inventory_2_outlined,
                                    size: 16,
                                    color: secondaryColor,
                                  ),
                                  const SizedBox(
                                    width: 10,
                                  ),
                                  Expanded(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text("Product Profit",
                                            style: TextStyle(
                                                color: secondaryColor,
                                                fontWeight: FontWeight.w400,
                                                fontSize: 10)),
                                        Row(
                                          children: [
                                            Expanded(
                                              flex: 3,
                                              child: Text(
                                                "₹ " +
                                                    receivedData[
                                                        'product_profit'],
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
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
                          ),
                        ],
                      ),
                      const SizedBox(
                        height: 4,
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              height: 50,
                              margin: const EdgeInsets.fromLTRB(0, 0, 2, 0),
                              padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
                              decoration: BoxDecoration(
                                  color: thirdColor,
                                  borderRadius: BorderRadius.circular(10)),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.local_shipping_outlined,
                                    size: 16,
                                    color: secondaryColor,
                                  ),
                                  const SizedBox(
                                    width: 10,
                                  ),
                                  Expanded(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text("Transportation Cost",
                                            style: TextStyle(
                                                color: secondaryColor,
                                                fontWeight: FontWeight.w400,
                                                fontSize: 10)),
                                        Row(
                                          children: [
                                            Expanded(
                                              flex: 3,
                                              child: Text(
                                                "₹ " +
                                                    receivedData[
                                                        'transportation_cost'],
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
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
                          ),
                          Expanded(
                            child: Container(
                              height: 50,
                              margin: const EdgeInsets.fromLTRB(2, 0, 0, 0),
                              padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
                              decoration: BoxDecoration(
                                  color: thirdColor,
                                  borderRadius: BorderRadius.circular(10)),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.barcode_reader,
                                    size: 16,
                                    color: secondaryColor,
                                  ),
                                  const SizedBox(
                                    width: 10,
                                  ),
                                  Expanded(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text("Barcode ID",
                                            style: TextStyle(
                                                color: secondaryColor,
                                                fontWeight: FontWeight.w400,
                                                fontSize: 10)),
                                        const SizedBox(
                                          height: 2,
                                        ),
                                        receivedData['product_barcodedata'] ==
                                                null
                                            ? const SizedBox()
                                            : Row(
                                                children: [
                                                  Expanded(
                                                    flex: 3,
                                                    child: Text(
                                                      receivedData[
                                                          'product_barcodedata'],
                                                      maxLines: 1,
                                                      overflow:
                                                          TextOverflow.ellipsis,
                                                      style: const TextStyle(
                                                          color: secondaryColor,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                          fontSize: 10),
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
                          ),
                        ],
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              margin: EdgeInsets.fromLTRB(0, 10, 2, 0),
                              padding:
                                  const EdgeInsets.fromLTRB(20, 10, 20, 10),
                              decoration: BoxDecoration(
                                  color: primaryColor,
                                  borderRadius: BorderRadius.circular(10)),
                              child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    "Amount Invested",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500),
                                  ),
                                  Text(
                                    "₹ " + receivedData['amount_invested'],
                                    style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 25,
                                        fontWeight: FontWeight.w500),
                                  )
                                ],
                              ),
                            ),
                          ),
                          Expanded(
                            child: Container(
                              margin: EdgeInsets.fromLTRB(2, 10, 0, 0),
                              padding:
                                  const EdgeInsets.fromLTRB(20, 10, 20, 10),
                              decoration: BoxDecoration(
                                  color: primaryColor,
                                  borderRadius: BorderRadius.circular(10)),
                              child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    "Total Profit",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500),
                                  ),
                                  Text(
                                    "₹ " + receivedData['total_profit'],
                                    style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 25,
                                        fontWeight: FontWeight.w500),
                                  )
                                ],
                              ),
                            ),
                          )
                        ],
                      ),
                    ]),
              ),
            ),
      bottomNavigationBar: Container(
        height: 110,
        margin: MediaQuery.of(context).viewInsets,
        padding: EdgeInsets.fromLTRB(20, 20, 20, 20),
        child: Row(
          children: [
            Expanded(
              flex: 1,
              child: Container(
                height: 80,
                margin: EdgeInsets.fromLTRB(0, 0, 3, 0),
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey.shade300),
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10)),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextFormField(
                      validator: (value) {
                        if (value!.isEmpty) return "Enter Product Name";
                      },
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      controller: _quantity,
                      keyboardType: TextInputType.number,
                      cursorColor: Colors.black,
                      decoration: const InputDecoration(
                        hintText: "Quantity",
                        hintStyle: TextStyle(
                            fontWeight: FontWeight.w300, color: secondaryColor),
                        border: InputBorder.none,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              flex: 2,
              child: InkWell(
                onTap: () {
                  addToInventory();
                },
                child: Container(
                  height: 80,
                  margin: EdgeInsets.fromLTRB(3, 0, 0, 0),
                  padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                  decoration: BoxDecoration(
                      color: primaryColor,
                      borderRadius: BorderRadius.circular(10)),
                  child: const Center(
                    child: Text(
                      "Add to Current Inventory",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
