import 'dart:convert';
import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:currency_text_input_formatter/currency_text_input_formatter.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:intl/intl.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';

import '../../constants/colors.dart';
import '../home/home.dart';

class AddProduct extends StatefulWidget {
  const AddProduct({super.key});

  @override
  State<AddProduct> createState() => _AddProductState();
}

class _AddProductState extends State<AddProduct> {
  TextEditingController _productName = new TextEditingController();
  TextEditingController _productDescription = new TextEditingController();
  TextEditingController _productRate = new TextEditingController();
  TextEditingController _productProfit = new TextEditingController();
  TextEditingController _transportationCost = new TextEditingController();
  var _productBarCodeData;
  String _productImage = "";

  final formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
  }

  Future addProduct() async {
    try {
      if (formKey.currentState!.validate()) {
        Get.dialog(const Center(child: CircularProgressIndicator()));
        var upload = await FirebaseFirestore.instance
            .collection('users')
            .doc(FirebaseAuth.instance.currentUser!.uid)
            .collection("products")
            .add({
          'product_name': _productName.text,
          'product_description': _productDescription.text,
          'product_rate': _productRate.text.toString(),
          'product_profit': _productProfit.text.toString(),
          'transportation_cost': _transportationCost.text.toString(),
          'product_image': _productImage.toString(),
          'product_barcodedata': _productBarCodeData.toString(),
          'created_time': DateTime.now(),
          'product_id': '',
          'amount_invested': '0',
          'net_profit': '0',
        });

        await FirebaseFirestore.instance
            .collection('users')
            .doc(FirebaseAuth.instance.currentUser!.uid)
            .collection("products")
            .doc(await upload.id)
            .update({
          'product_id': await upload.id,
        });

        Get.back();
        Get.offAll(const Home(), transition: Transition.downToUp);

        Get.snackbar("Product Added Successfully",
            "Your product was added successfully");
      }
    } on FirebaseException catch (e) {
      Get.snackbar("Error Adding Product", e.toString());
    }
  }

  Future pickFile() async {
    FilePickerResult? result =
        await FilePicker.platform.pickFiles(type: FileType.image);
    if (result != null) {
      PlatformFile file = result.files.first;
      try {
        Reference storageRef = FirebaseStorage.instance
            .ref('images')
            .child(DateTime.now().toString() + file.name);
        UploadTask uploadTask = storageRef.putFile(File(file.path!));
        await uploadTask.whenComplete(
          () async {
            _productImage = (await storageRef.getDownloadURL()).toString();
            setState(() {});
          },
        );
      } catch (e) {
        print('Error uploading file: $e');
      }
    } else {
      print('User canceled file picker');
      Get.snackbar('Error', 'User canceled file picker');
    }
  }

  Future scanBarcode() async {
    var res = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const SimpleBarcodeScannerPage(),
        ));
    setState(() {
      if (res is String) {
        _productBarCodeData = res;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
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
                        "Add New Product",
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
              Divider(
                color: Colors.grey.shade300,
              )
            ],
          )),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(30, 0, 30, 0),
          child: Form(
            key: formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Product Name",
                  style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: secondaryColor,
                      fontSize: 15),
                ),
                Container(
                  margin: const EdgeInsets.fromLTRB(0, 10, 0, 15),
                  padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
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
                        if (value!.isEmpty) return "Enter Product Name";
                      },
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      controller: _productName,
                      cursorColor: Colors.black,
                      decoration: const InputDecoration(
                        hintText: "Product Name",
                        hintStyle: TextStyle(
                            fontWeight: FontWeight.w300, color: secondaryColor),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.fromLTRB(0, 10, 0, 15),
                  padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                  width: double.infinity,
                  height: 180,
                  decoration: BoxDecoration(
                      color: thirdColor,
                      border: Border.all(
                        color: Colors.grey.shade200,
                      ),
                      borderRadius: BorderRadius.circular(10)),
                  child: Center(
                    child: TextFormField(
                      validator: (value) {
                        if (value!.isEmpty) return "Enter Case Description";
                      },
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      maxLines: 10,
                      controller: _productDescription,
                      cursorColor: Colors.black,
                      decoration: const InputDecoration(
                        hintText: 'Enter Product Description',
                        hintStyle: TextStyle(
                            fontWeight: FontWeight.w300, color: secondaryColor),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                customInputCard(
                    title: "Product Rate",
                    hint: "Enter Product Rate",
                    error: "Enter Product Rate",
                    controller: _productRate),
                customInputCard(
                    title: "Product Profit",
                    hint: "Enter Product Profit",
                    error: "Enter Product Profit",
                    controller: _productProfit),
                customInputCard(
                    title: "Transportation Cost",
                    hint: "Enter Transportation Cost",
                    error: "Enter Transportation Cost",
                    controller: _transportationCost),
                InkWell(
                  onTap: () => scanBarcode(),
                  child: Container(
                    margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                    height: 60,
                    padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                    width: double.infinity,
                    decoration: BoxDecoration(
                        color: primaryColor,
                        border: Border.all(
                          color: Colors.grey.shade200,
                        ),
                        borderRadius: BorderRadius.circular(10)),
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
                InkWell(
                  onTap: () => pickFile(),
                  child: Container(
                    margin: const EdgeInsets.fromLTRB(0, 10, 0, 15),
                    height: 60,
                    padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                    width: double.infinity,
                    decoration: BoxDecoration(
                        color: primaryColor,
                        border: Border.all(
                          color: Colors.grey.shade200,
                        ),
                        borderRadius: BorderRadius.circular(10)),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Upload Product Image',
                          style: TextStyle(
                            fontWeight: FontWeight.w300,
                            fontSize: 15,
                            color: Colors.white,
                          ),
                        ),
                        Icon(Icons.file_upload_outlined, color: Colors.white),
                      ],
                    ),
                  ),
                ),
                _productImage == ""
                    ? const SizedBox()
                    : Container(
                        margin: const EdgeInsets.fromLTRB(0, 0, 0, 15),
                        height: 200,
                        padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                        width: double.infinity,
                        decoration: BoxDecoration(
                            image: DecorationImage(
                                image: NetworkImage(_productImage.toString()),
                                fit: BoxFit.cover),
                            border: Border.all(
                              color: Colors.grey.shade200,
                            ),
                            borderRadius: BorderRadius.circular(10)),
                      )
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: InkWell(
        onTap: () {
          addProduct();
        },
        child: Container(
          height: 60,
          decoration: const BoxDecoration(color: primaryColor),
          child: const Center(
            child: Text(
              'Submit Report',
              style: TextStyle(
                fontWeight: FontWeight.w300,
                fontSize: 15,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

Widget customInputCard({title, hint, error, controller}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        title,
        style: const TextStyle(
            fontWeight: FontWeight.w600, color: secondaryColor, fontSize: 15),
      ),
      Container(
        margin: const EdgeInsets.fromLTRB(0, 10, 0, 15),
        padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
        width: double.infinity,
        decoration: BoxDecoration(
            color: thirdColor,
            border: Border.all(
              color: Colors.grey.shade200,
            ),
            borderRadius: BorderRadius.circular(10)),
        child: Center(
          child: TextFormField(
            inputFormatters: [
              CurrencyTextInputFormatter(
                  locale: 'en_IN', decimalDigits: 0, symbol: "₹ ")
            ],
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value!.isEmpty) return error;
            },
            autovalidateMode: AutovalidateMode.onUserInteraction,
            controller: controller,
            cursorColor: Colors.black,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(
                  fontWeight: FontWeight.w300, color: secondaryColor),
              border: InputBorder.none,
            ),
          ),
        ),
      ),
    ],
  );
}
