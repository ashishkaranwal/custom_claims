const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const crypto = require('crypto');
const PaytmChecksum = require('paytmchecksum');

admin.initializeApp();


exports.processNewUser = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    try {
      const userData = snap.data();
      const userId = context.params.userId; // Get the userId from context

      // Check the role and assign custom claims accordingly
      if (userData.isAdmin) {
        await admin.auth().setCustomUserClaims(userId, { isAdmin: true });
        console.log(`Success! User with ID ${userId} has been made an admin.`);
      } else if (userData.isSuperAdmin) {
        await admin.auth().setCustomUserClaims(userId, { isSuperAdmin: true });
        console.log(`Success! User with ID ${userId} has been made a super admin.`);
      } else if (userData.isVendor) {
        await admin.auth().setCustomUserClaims(userId, { isVendor: true });
        console.log(`Success! User with ID ${userId} has been made a vendor.`);
      } else if (userData.isCm) {
        await admin.auth().setCustomUserClaims(userId, { isCm: true });
        console.log(`Success! User with ID ${userId} has been made a Circle Manager.`);
      } else {
        console.log('No role specified for the user.');
      }
    } catch (err) {
      console.error(err);
    }
  });