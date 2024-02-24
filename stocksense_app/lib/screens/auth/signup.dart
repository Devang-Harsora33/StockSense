import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/get_utils/src/get_utils/get_utils.dart';
import 'package:get/route_manager.dart';
import 'package:stocksense_app/screens/auth/signin.dart';
import 'package:stocksense_app/screens/home/home.dart';

import '../../constants/colors.dart';

class SignUp extends StatefulWidget {
  const SignUp({Key? key}) : super(key: key);

  @override
  _SignUpState createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  @override
  TextEditingController _usernameController = new TextEditingController();
  TextEditingController _emailController = new TextEditingController();
  TextEditingController _passwordController = new TextEditingController();
  TextEditingController _password2Controller = new TextEditingController();
  var isPasswordVisible = false;
  var isPassword2Visible = false;

  final formKey = GlobalKey<FormState>();

  Future signUp() async {
    try {
      if (!formKey.currentState!.validate()) return;
      Get.dialog(const Center(child: CircularProgressIndicator()));

      _passwordController.text == _password2Controller.text
          ? await FirebaseAuth.instance.createUserWithEmailAndPassword(
              email: _emailController.text, password: _passwordController.text)
          : Get.snackbar("Error Signing Up!", "Passwords do not match");

      await FirebaseAuth.instance.currentUser
          ?.updateDisplayName(_usernameController.text);

      await FirebaseFirestore.instance
          .collection("users")
          .doc(FirebaseAuth.instance.currentUser!.uid)
          .set(
        {
          'uid': FirebaseAuth.instance.currentUser!.uid,
          'name': _usernameController.text,
          'email': _emailController.text,
        },
      );
      Get.offAll(const Home(), transition: Transition.fadeIn);
    } on FirebaseAuthException catch (e) {
      Get.back();
      Get.snackbar("Error Signing Up!", e.toString());
    }
  }

  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.fromLTRB(30, 0, 30, 0),
        child: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  children: [
                    const Column(
                      children: [
                        SizedBox(
                          height: 60,
                        ),
                        Row(
                          children: [
                            Expanded(
                              child: Text('Hello, Welcome to StockSense!',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 30,
                                  )),
                            ),
                          ],
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Row(
                          children: [
                            Text('Manage your inventory at ease!',
                                style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                    color: secondaryColor))
                          ],
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(0, 30, 0, 30),
                      child: SvgPicture.asset('assets/svg/signup.svg',
                          height: 200),
                    ),
                    Column(
                      children: [
                        Container(
                          margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                          width: double.infinity,
                          padding: EdgeInsets.all(5),
                          decoration: BoxDecoration(
                              color: thirdColor,
                              border: Border.all(
                                color: Colors.grey.shade200,
                              ),
                              borderRadius: BorderRadius.circular(10)),
                          child: Center(
                            child: TextFormField(
                              validator: (value) {
                                if (value!.isEmpty) return "Enter Username";
                              },
                              autovalidateMode:
                                  AutovalidateMode.onUserInteraction,
                              controller: _usernameController,
                              cursorColor: Colors.black,
                              decoration: const InputDecoration(
                                hintText: 'Username',
                                hintStyle: TextStyle(
                                    fontWeight: FontWeight.w300,
                                    color: secondaryColor),
                                prefixIcon: Icon(
                                  Icons.person_outline,
                                  color: secondaryColor,
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                          width: double.infinity,
                          padding: EdgeInsets.all(5),
                          decoration: BoxDecoration(
                              color: thirdColor,
                              border: Border.all(
                                color: Colors.grey.shade200,
                              ),
                              borderRadius: BorderRadius.circular(10)),
                          child: Center(
                            child: TextFormField(
                              validator: (value) {
                                if (!GetUtils.isEmail(value!))
                                  return "Enter Email ID";
                              },
                              autovalidateMode:
                                  AutovalidateMode.onUserInteraction,
                              controller: _emailController,
                              cursorColor: Colors.black,
                              decoration: const InputDecoration(
                                hintText: 'Email',
                                hintStyle: TextStyle(
                                    fontWeight: FontWeight.w300,
                                    color: secondaryColor),
                                prefixIcon: Icon(
                                  Icons.email_outlined,
                                  color: secondaryColor,
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                          width: double.infinity,
                          padding: EdgeInsets.all(5),
                          decoration: BoxDecoration(
                              color: thirdColor,
                              border: Border.all(
                                color: Colors.grey.shade200,
                              ),
                              borderRadius: BorderRadius.circular(10)),
                          child: Center(
                            child: TextFormField(
                              validator: (value) {
                                if (value!.isEmpty) return "Enter Password";
                              },
                              autovalidateMode:
                                  AutovalidateMode.onUserInteraction,
                              obscureText: isPasswordVisible ? false : true,
                              controller: _passwordController,
                              cursorColor: Colors.black,
                              decoration: InputDecoration(
                                hintText: 'Password',
                                hintStyle: const TextStyle(
                                    fontWeight: FontWeight.w300,
                                    color: secondaryColor),
                                prefixIcon: const Icon(
                                  Icons.password,
                                  color: secondaryColor,
                                ),
                                suffixIcon: InkWell(
                                  onTap: () {
                                    setState(() {
                                      isPasswordVisible = !isPasswordVisible;
                                    });
                                  },
                                  child: Icon(
                                    isPasswordVisible
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: secondaryColor,
                                  ),
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                          padding: EdgeInsets.all(5),
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
                                if (value!.isEmpty ||
                                    value != _passwordController.text)
                                  return "Enter Correct Password";
                              },
                              autovalidateMode:
                                  AutovalidateMode.onUserInteraction,
                              obscureText: isPassword2Visible ? false : true,
                              controller: _password2Controller,
                              cursorColor: Colors.black,
                              decoration: InputDecoration(
                                hintText: 'Confirm Password',
                                hintStyle: const TextStyle(
                                    fontWeight: FontWeight.w300,
                                    color: secondaryColor),
                                prefixIcon: const Icon(
                                  Icons.password,
                                  color: secondaryColor,
                                ),
                                suffixIcon: InkWell(
                                  onTap: () {
                                    setState(() {
                                      isPassword2Visible = !isPassword2Visible;
                                    });
                                  },
                                  child: Icon(
                                    isPassword2Visible
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: secondaryColor,
                                  ),
                                ),
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        InkWell(
                          onTap: () {
                            signUp();
                          },
                          child: Container(
                            margin: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                            width: double.infinity,
                            height: 60,
                            decoration: BoxDecoration(
                                color: primaryColor,
                                borderRadius: BorderRadius.circular(10)),
                            child: const Center(
                              child: Text(
                                'Register',
                                style: TextStyle(
                                  fontWeight: FontWeight.w300,
                                  fontSize: 16,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Already have an account? ',
                              style: TextStyle(
                                fontWeight: FontWeight.w300,
                                fontSize: 14,
                              ),
                            ),
                            InkWell(
                              onTap: () {
                                Get.offAll(const SignIn(),
                                    transition: Transition.fadeIn);
                              },
                              child: const Text(
                                'Log In',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                  color: primaryColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
