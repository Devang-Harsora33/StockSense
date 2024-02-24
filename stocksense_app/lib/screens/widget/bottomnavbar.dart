import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:stocksense_app/screens/inventory/myinventory.dart';
import 'package:stocksense_app/screens/product/myproducts.dart';

import '../../constants/colors.dart';
import '../home/home.dart';

class Bottomnavbar extends StatefulWidget {
  int currentIndex = 0;
  Bottomnavbar(this.currentIndex, {Key? key}) : super(key: key);

  @override
  _BottomnavbarState createState() => _BottomnavbarState();
}

class _BottomnavbarState extends State<Bottomnavbar> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      showUnselectedLabels: true,
      showSelectedLabels: true,
      selectedIconTheme: IconThemeData(color: primaryColor),
      unselectedIconTheme: IconThemeData(color: Colors.grey[400]),
      type: BottomNavigationBarType.fixed,
      selectedLabelStyle: TextStyle(color: primaryColor, fontSize: 10),
      unselectedLabelStyle: TextStyle(color: Colors.black, fontSize: 10),
      currentIndex: widget.currentIndex,
      items: [
        BottomNavigationBarItem(
          icon: Icon(
            Icons.dashboard_outlined,
          ),
          label: 'Dashboard',
        ),
        BottomNavigationBarItem(
            icon: Icon(
              Icons.inventory_2_outlined,
            ),
            label: 'My Inventory'),
        BottomNavigationBarItem(
            icon: Icon(
              Icons.abc,
              color: Colors.transparent,
            ),
            label: ''),
        BottomNavigationBarItem(
            icon: Icon(
              Icons.inventory_2_outlined,
            ),
            label: 'My Products'),
        BottomNavigationBarItem(
            icon: Icon(
              Icons.inventory_2_outlined,
            ),
            label: 'Nearby Sellers')
      ],
      onTap: (value) {
        if (value == 0) {
          Get.offAll(() => const Home(), transition: Transition.fadeIn);
        }
        if (value == 1) {
          Get.offAll(() => const MyInventory(), transition: Transition.fadeIn);
        }
        if (value == 3) {
          Get.offAll(() => const MyProducts(), transition: Transition.fadeIn);
        }
      },
    );
  }
}
