import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';

import '../../constants/colors.dart';
import '../initial/splashscreen.dart';
import '../widget/bottomnavbar.dart';
import '../widget/floatingactionbutton.dart';

class Admin extends StatefulWidget {
  const Admin({Key? key}) : super(key: key);

  @override
  _AdminState createState() => _AdminState();
}

class _AdminState extends State<Admin> {
  var team_code = '';
  TextEditingController _teamcodeController = new TextEditingController();
  Future team_codevalidate() async {
    setState(() {});
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
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(25, 0, 25, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Share your inventory & allow others to manage it.',
                style: TextStyle(
                    color: secondaryColor, fontWeight: FontWeight.w600),
              ),
              SizedBox(
                height: 50,
              ),
              const Text(
                'Are you an admin?',
                style: TextStyle(
                    color: secondaryColor, fontWeight: FontWeight.w600),
              ),
              Divider(
                color: Colors.grey.shade300,
              ),
              InkWell(
                onTap: () => {
                  team_code =
                      FirebaseAuth.instance.currentUser!.uid.substring(0, 6),
                  FirebaseFirestore.instance
                      .collection('team')
                      .doc(team_code)
                      .set({
                    'team_code': team_code,
                    'admin': FirebaseAuth.instance.currentUser!.uid,
                    'members': [],
                  }),
                  setState(() {}),
                },
                child: Container(
                  margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                  height: 60,
                  padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                  width: double.infinity,
                  decoration: BoxDecoration(
                      color: primaryColor,
                      borderRadius: BorderRadius.circular(10)),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Generate Team Code',
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
              team_code == ""
                  ? SizedBox()
                  : InkWell(
                      onTap: () async {
                        await Clipboard.setData(ClipboardData(
                            text:
                                "Here is your code to join me on StockSense: $team_code"));
                      },
                      child: Container(
                        margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                        height: 60,
                        padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                        width: double.infinity,
                        decoration: BoxDecoration(
                            color: thirdColor,
                            borderRadius: BorderRadius.circular(10)),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              team_code,
                              style: TextStyle(
                                  letterSpacing: 10,
                                  color: secondaryColor,
                                  fontSize: 20,
                                  fontWeight: FontWeight.w600),
                            ),
                            Icon(Icons.content_copy, color: Colors.black),
                          ],
                        ),
                      ),
                    ),
              // SizedBox(
              //     height: 100,
              //     child: StreamBuilder(
              //       stream: FirebaseFirestore.instance
              //           .collection('team')
              //           .snapshots(),
              //       builder: (BuildContext context,
              //           AsyncSnapshot<QuerySnapshot> snapshot) {
              //         if (!snapshot.hasData) {
              //           return const Center(
              //             child: CircularProgressIndicator(),
              //           );
              //         }
              //         return ListView.builder(
              //           itemCount: snapshot.data!.docs.length,
              //           itemBuilder: (BuildContext context, int index) {
              //             return Container(
              //               margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
              //               height: 60,
              //               padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
              //               width: double.infinity,
              //               decoration: BoxDecoration(
              //                   color: thirdColor,
              //                   borderRadius: BorderRadius.circular(10)),
              //               child: Row(
              //                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
              //                 children: [
              //                   Expanded(
              //                     child: Text(
              //                       snapshot.data!.docs[index]['members'][0],
              //                       style: TextStyle(
              //                           color: secondaryColor,
              //                           fontSize: 20,
              //                           fontWeight: FontWeight.w600),
              //                     ),
              //                   ),
              //                   Icon(Icons.arrow_forward, color: Colors.black),
              //                 ],
              //               ),
              //             );
              //           },
              //         );
              //       },
              //     )),
              SizedBox(
                height: 50,
              ),
              Row(
                children: [
                  Expanded(
                    child: Divider(
                      color: Colors.grey.shade300,
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: Text('OR',
                          style: TextStyle(
                              color: secondaryColor,
                              fontWeight: FontWeight.w600)),
                    ),
                  ),
                  Expanded(
                    child: Divider(
                      color: Colors.grey.shade300,
                    ),
                  ),
                ],
              ),
              Container(
                margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                height: 60,
                padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
                width: double.infinity,
                decoration: BoxDecoration(
                    color: thirdColor, borderRadius: BorderRadius.circular(10)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _teamcodeController,
                        decoration: InputDecoration(
                          border: InputBorder.none,
                          hintText: 'Enter Team Code',
                          hintStyle: TextStyle(
                              color: secondaryColor,
                              fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                    InkWell(
                        onTap: () async {
                          try {
                            await FirebaseFirestore.instance
                                .collection('team')
                                .doc(_teamcodeController.text)
                                .update({
                              'members': FieldValue.arrayUnion(
                                  [FirebaseAuth.instance.currentUser!.uid]),
                            });
                            Get.snackbar("Success", "You have joined the team");
                          } catch (e) {
                            Get.snackbar("Error", "Invalid Team Code");
                          }
                          setState(() {});
                        },
                        child: Icon(Icons.arrow_forward, color: Colors.black)),
                  ],
                ),
              ),
              SizedBox(
                height: 5,
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: Floatingactionbutton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: Bottomnavbar(4),
    );
  }
}
