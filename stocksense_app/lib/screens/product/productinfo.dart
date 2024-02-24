import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../constants/colors.dart';

class Productinfo extends StatefulWidget {
  var product_id;
  Productinfo(this.product_id, {Key? key}) : super(key: key);

  @override
  _ProductinfoState createState() => _ProductinfoState();
}

class _ProductinfoState extends State<Productinfo> {
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
              Divider(
                color: Colors.grey.shade300,
              )
            ],
          )),
    );
  }
}
