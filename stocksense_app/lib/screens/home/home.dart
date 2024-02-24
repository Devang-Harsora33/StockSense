import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:stocksense_app/main.dart';
import 'package:stocksense_app/screens/addproduct/addproduct.dart';
import 'package:stocksense_app/screens/product/myproducts.dart';

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
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: InkWell(
          onTap: () => Get.off(() => const MyProducts()),
          child: Center(child: const Text("Home"))),
    );
  }
}
