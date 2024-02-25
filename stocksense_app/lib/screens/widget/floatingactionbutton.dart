import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:stocksense_app/screens/product/productinfo.dart';

import '../../constants/colors.dart';
import '../addproduct/addproduct.dart';

class Floatingactionbutton extends StatefulWidget {
  const Floatingactionbutton({Key? key}) : super(key: key);

  @override
  _FloatingactionbuttonState createState() => _FloatingactionbuttonState();
}

class _FloatingactionbuttonState extends State<Floatingactionbutton> {
  var _productBarCodeData;
  Future scanBarcode() async {
    var res = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const SimpleBarcodeScannerPage(),
        ));

    if (res is String) {
      _productBarCodeData = res;

      await FirebaseFirestore.instance
          .collection("users")
          .doc(FirebaseAuth.instance.currentUser!.uid)
          .collection("products")
          .where("product_barcodedata", isEqualTo: _productBarCodeData)
          .get()
          .then((value) {
        setState(() {
          print(value.docs.first.data());
          if (value.docs.isEmpty) {
            Get.snackbar("Product Doesn't Exists",
                "Product with this barcode doesn't exists");
          } else {
            Get.to(() => Productinfo(value.docs.first.data()['product_id']));
          }
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: () {
        scanBarcode();
        // Get.bottomSheet(Container(
        //     padding: EdgeInsets.fromLTRB(20, 0, 20, 0),
        //     color: Colors.white,
        //     height: 200,
        //     child: Column(
        //       children: [
        //         ListTile(
        //           leading: const Icon(Icons.add),
        //           title: const Text('Add Product'),
        //           onTap: () {
        //             Get.to(() => const AddProduct());
        //           },
        //         ),
        //         InkWell(
        //           onTap: () => scanBarcode(),
        //           child: Container(
        //             margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
        //             height: 60,
        //             padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
        //             width: double.infinity,
        //             decoration: BoxDecoration(
        //                 color: primaryColor,
        //                 borderRadius: BorderRadius.circular(10)),
        //             child: const Row(
        //               mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //               children: [
        //                 Text(
        //                   'Scan Barcode Data',
        //                   style: TextStyle(
        //                     fontWeight: FontWeight.w300,
        //                     fontSize: 15,
        //                     color: Colors.white,
        //                   ),
        //                 ),
        //                 Icon(Icons.barcode_reader, color: Colors.white),
        //               ],
        //             ),
        //           ),
        //         ),
        //       ],
        //     )));
      },
      child: const Icon(
        Icons.camera_alt_outlined,
        color: Colors.white,
      ),
      backgroundColor: primaryColor,
    );
  }
}
