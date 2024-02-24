import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';

import '../../constants/colors.dart';

class Floatingactionbutton extends StatefulWidget {
  const Floatingactionbutton({Key? key}) : super(key: key);

  @override
  _FloatingactionbuttonState createState() => _FloatingactionbuttonState();
}

class _FloatingactionbuttonState extends State<Floatingactionbutton> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 55,
      child: FloatingActionButton(
        onPressed: () {},
        child: const Icon(
          Icons.add,
          color: Colors.white,
        ),
        backgroundColor: primaryColor,
      ),
    );
  }
}
