import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/route_manager.dart';
import 'package:stocksense_app/screens/addproduct/addproduct.dart';
import 'package:stocksense_app/screens/product/productinfo.dart';
import 'package:stocksense_app/screens/widget/bottomnavbar.dart';

import '../../constants/colors.dart';
import '../home/home.dart';
import '../initial/splashscreen.dart';

class MyProducts extends StatefulWidget {
  const MyProducts({super.key});

  @override
  State<MyProducts> createState() => _MyProductsState();
}

class _MyProductsState extends State<MyProducts> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
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
      body: Padding(
        padding: const EdgeInsets.fromLTRB(25, 0, 25, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'My Products',
              style:
                  TextStyle(color: secondaryColor, fontWeight: FontWeight.w600),
            ),
            SizedBox(
              height: 20,
            ),
            Expanded(
              child: StreamBuilder(
                stream: FirebaseFirestore.instance
                    .collection('users')
                    .doc(FirebaseAuth.instance.currentUser!.uid)
                    .collection("products")
                    .orderBy('product_name')
                    .snapshots(),
                builder: (context, snapshot) {
                  if (!snapshot.hasData) {
                    return const SizedBox(
                      height: 160,
                      child: Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                  } else {
                    return ListView.builder(
                        itemCount: snapshot.data!.docs.length,
                        scrollDirection: Axis.vertical,
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
                          );
                        });
                  }
                },
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Bottomnavbar(3),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: Container(
        height: 55,
        child: FloatingActionButton(
          onPressed: () {
            Get.to(const AddProduct(), transition: Transition.fadeIn);
          },
          child: const Icon(
            Icons.add,
            color: Colors.white,
          ),
          backgroundColor: primaryColor,
        ),
      ),
    );
  }

  Widget Card(
      {product_name,
      product_description,
      product_rate,
      product_profit,
      product_id,
      product_image}) {
    return GestureDetector(
      onTap: () => Get.to(
        () => Productinfo(product_id),
      ),
      child: Container(
          padding: const EdgeInsets.all(10),
          margin: const EdgeInsets.only(bottom: 10),
          height: 110,
          decoration: BoxDecoration(
              color: Colors.grey.shade50,
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
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    InkWell(
                      onTap: () async {
                        var rate = TextEditingController();
                        var profit = TextEditingController();
                        Get.bottomSheet(Container(
                            padding: EdgeInsets.fromLTRB(20, 0, 20, 0),
                            color: Colors.white,
                            height: 230,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                Container(
                                  margin:
                                      const EdgeInsets.fromLTRB(0, 10, 0, 5),
                                  padding:
                                      const EdgeInsets.fromLTRB(15, 0, 15, 0),
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                      color: thirdColor,
                                      border: Border.all(
                                        color: Colors.grey.shade200,
                                      ),
                                      borderRadius: BorderRadius.circular(10)),
                                  child: Center(
                                    child: TextFormField(
                                      validator: (value) {
                                        if (value!.isEmpty)
                                          return "Enter Updated Rate";
                                      },
                                      autovalidateMode:
                                          AutovalidateMode.onUserInteraction,
                                      controller: rate,
                                      cursorColor: Colors.black,
                                      decoration: const InputDecoration(
                                        hintText: "Enter Updated Rate",
                                        hintStyle: TextStyle(
                                            fontWeight: FontWeight.w300,
                                            color: secondaryColor),
                                        border: InputBorder.none,
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  margin: const EdgeInsets.fromLTRB(0, 0, 0, 5),
                                  padding:
                                      const EdgeInsets.fromLTRB(15, 0, 15, 0),
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                      color: thirdColor,
                                      border: Border.all(
                                        color: Colors.grey.shade200,
                                      ),
                                      borderRadius: BorderRadius.circular(10)),
                                  child: Center(
                                    child: TextFormField(
                                      validator: (value) {
                                        if (value!.isEmpty)
                                          return "Enter Updated Profit";
                                      },
                                      autovalidateMode:
                                          AutovalidateMode.onUserInteraction,
                                      controller: profit,
                                      cursorColor: Colors.black,
                                      decoration: const InputDecoration(
                                        hintText: "Enter Updated Profit",
                                        hintStyle: TextStyle(
                                            fontWeight: FontWeight.w300,
                                            color: secondaryColor),
                                        border: InputBorder.none,
                                      ),
                                    ),
                                  ),
                                ),
                                InkWell(
                                  onTap: () async {
                                    if (rate.text.isNotEmpty) {
                                      await FirebaseFirestore.instance
                                          .collection('users')
                                          .doc(FirebaseAuth
                                              .instance.currentUser!.uid)
                                          .collection("products")
                                          .doc(product_id)
                                          .update({
                                        'product_rate': rate.text,
                                      }).then((value) => {
                                                Get.snackbar(
                                                  "Success",
                                                  "Product Updated Successfully",
                                                )
                                              });
                                    }
                                    if (profit.text.isNotEmpty) {
                                      await FirebaseFirestore.instance
                                          .collection('users')
                                          .doc(FirebaseAuth
                                              .instance.currentUser!.uid)
                                          .collection("products")
                                          .doc(product_id)
                                          .update({
                                        'product_profit': profit.text
                                      }).then((value) => {
                                                Get.snackbar(
                                                  "Success",
                                                  "Product Updated Successfully",
                                                )
                                              });
                                    }
                                  },
                                  child: Container(
                                    margin:
                                        const EdgeInsets.fromLTRB(0, 5, 0, 0),
                                    height: 60,
                                    padding:
                                        const EdgeInsets.fromLTRB(15, 0, 15, 0),
                                    width: double.infinity,
                                    decoration: BoxDecoration(
                                        color: primaryColor,
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    child: const Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          'Update Product',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w300,
                                            fontSize: 15,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            )));
                      },
                      child: Icon(
                        Icons.edit_outlined,
                        color: secondaryColor,
                      ),
                    ),
                    InkWell(
                      onTap: () async {
                        await FirebaseFirestore.instance
                            .collection('users')
                            .doc(FirebaseAuth.instance.currentUser!.uid)
                            .collection("products")
                            .doc(product_id)
                            .delete()
                            .then((value) => {
                                  Get.snackbar(
                                    "Success",
                                    "Product Deleted Successfully",
                                  )
                                });
                      },
                      child: Icon(
                        Icons.delete_outline_outlined,
                        color: secondaryColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          )),
    );
  }
}
