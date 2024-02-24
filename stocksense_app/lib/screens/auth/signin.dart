import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/get.dart';
import 'package:get/route_manager.dart';
import 'package:stocksense_app/screens/auth/signup.dart';
import 'package:stocksense_app/screens/home/home.dart';
import '../../constants/colors.dart';

class SignIn extends StatefulWidget {
  const SignIn({Key? key}) : super(key: key);

  @override
  _SigninState createState() => _SigninState();
}

class _SigninState extends State<SignIn> {
  @override
  TextEditingController _emailController = new TextEditingController();
  TextEditingController _passwordController = new TextEditingController();
  var isPasswordVisible = false;

  final formKey = GlobalKey<FormState>();

  Future signIn() async {
    if (!formKey.currentState!.validate()) return;
    try {
      Get.dialog(const Center(child: CircularProgressIndicator()));
      await FirebaseAuth.instance
          .signInWithEmailAndPassword(
              email: _emailController.text, password: _passwordController.text)
          .then((value) {
        Get.back();
        Get.offAll(const Home(), transition: Transition.fadeIn);
      });
    } on FirebaseAuthException catch (e) {
      Get.back();
      Get.snackbar("Error Signing In!", e.toString());
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
                            Text(
                              'Welcome back,',
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 30,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            Text('Login to continue!',
                                style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 30,
                                )),
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
                      padding: const EdgeInsets.fromLTRB(10, 30, 10, 30),
                      child:
                          SvgPicture.asset('assets/svg/login.svg', height: 200),
                    ),
                    Column(
                      children: [
                        Container(
                          margin: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          width: double.infinity,
                          padding: EdgeInsets.all(5),
                          decoration: BoxDecoration(
                              color: thirdColor,
                              border: Border.all(
                                color: Colors.grey.shade200,
                              ),
                              borderRadius: BorderRadius.circular(8)),
                          child: Center(
                            child: TextFormField(
                              validator: (value) {
                                if (!GetUtils.isEmail(value!))
                                  return "Enter Valid Email";
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
                              borderRadius: BorderRadius.circular(8)),
                          child: Center(
                            child: TextFormField(
                              validator: (value) {
                                if (value!.isEmpty)
                                  return "Enter Correct Password";
                              },
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
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            InkWell(
                              onTap: () async {
                                try {
                                  Get.dialog(const Center(
                                      child: CircularProgressIndicator()));
                                  await FirebaseAuth.instance
                                      .sendPasswordResetEmail(
                                          email: _emailController.text);
                                  Get.back();
                                  Get.snackbar("Password Reset Sent!",
                                      "Please Check Your Email");
                                } on FirebaseAuthException catch (e) {
                                  Get.back();
                                  Get.snackbar("Error Sending Password Reset!",
                                      e.toString());
                                }
                              },
                              child: const Text(
                                'Forgot Password?',
                                style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                    color: secondaryColor),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 30,
                        ),
                        InkWell(
                          onTap: () {
                            signIn();
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
                                'Login',
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
                              'Don\'t have an account? ',
                              style: TextStyle(
                                fontWeight: FontWeight.w300,
                                fontSize: 14,
                              ),
                            ),
                            InkWell(
                              onTap: () {
                                Get.to(
                                  () => const SignUp(),
                                  transition: Transition.fadeIn,
                                );
                              },
                              child: const Text(
                                'Sign Up',
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
