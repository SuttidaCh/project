<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit.prevent="addData">
      <h1>ชำระค่าบริการ</h1>
      <br />
      <div class="row md-5">
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="ชื่อ-สกุล"
          class="ma-3"
          required
        ></v-text-field>
        <v-text-field
          v-model="phone"
          :rules="phoneRules"
          label="เบอร์โทร"
          class="ma-3"
          required
        ></v-text-field>
      </div>
      <div class="row md-5">
        <v-text-field
          v-model="address"
          :rules="addressRules"
          label="ที่อยู่"
          class="ma-3"
          required
        ></v-text-field>
      </div>
      <div class="row md-5">
        <v-text-field
          v-model="district"
          :rules="districtRules"
          label="อำเภอ"
          class="ma-3"
          required
        ></v-text-field>
        <v-text-field
          v-model="province"
          :rules="provinceRules"
          label="จังหวัด"
          class="ma-3"
          required
        ></v-text-field>
      </div>
      <div class="row md-5">
        <v-text-field
          v-model="postcode"
          :rules="postcodeRules"
          label="รหัสไปรษณีย์"
          class="ma-3"
          required
        ></v-text-field>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              :rules="dateRules"
              label="ปี/เดือน/วัน"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              class="ma-3"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            ref="picker"
            v-model="date"
            :max="new Date().toISOString().substr(0, 10)"
            min="1950-01-01"
            @change="save"
          ></v-date-picker>
        </v-menu>
      </div>
      <br />
      <div>ปลายทาง</div>
      <v-radio-group v-model="area" row>
        <v-radio :label="`กรุงเทพฯ`" required></v-radio>
        <v-radio :label="`ต่างจังหวัด`" required></v-radio>
      </v-radio-group>
      <br />
      <v-row justify="space-between">
        <v-col cols="12" md="5">
          <div>จำนวนกล่อง</div>
          <v-select
            v-model="quantity"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="จำนวนกล่อง"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <div>ขนาดกล่อง</div>
          <v-radio-group v-model="sizebox" required row>
            <v-radio :label="`S`" required></v-radio>
            <v-radio :label="`M`" required></v-radio>
            <v-radio :label="`L`" required></v-radio>
            <v-radio :label="`XL`" required></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <br />
      <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="!valid"
            color="#EDE7F6"
            v-bind="attrs"
            class="mr-2"
            @click="addData"
            v-on="on"
          >
            ยืนยัน
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline"> ยืนยันสำเร็จ </v-card-title>
          <v-card-text>บันทึกข้อมูลเรียบร้อย</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">
              ปิด
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn color="#B39DDB" class="mr-4" @click="reset"> เริ่มใหม่ </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import { db } from '~/plugins/firebaseConfig.js'
export default {
  data() {
    return {
      valid: true,
      name: '',
      nameRules: [(v) => !!v || 'Name is required'],
      phone: '',
      phoneRules: [
        (v) => !!v || 'Phone is required',
        (v) => (v && v.length <= 10) || 'Phone must be less than 10 characters',
      ],
      address: '',
      addressRules: [(v) => !!v || 'Address is required'],
      district: '',
      districtRules: [(v) => !!v || 'District is required'],
      province: '',
      provinceRules: [(v) => !!v || 'Province is required'],
      postcode: '',
      postcodeRules: [
        (v) => !!v || 'Post code is required',
        (v) =>
          (v && v.length <= 5) || 'Post code must be less than 5 characters',
      ],
      date: '',
      dateRules: [(v) => !!v || 'Date is required'],
      menu: false,
      area: null,
      sizebox: ['S', 'M', 'L', 'XL'],
      value: '',
      quantity: null,
      items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      dialog: false,
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date)
    },
    getData() {
      db.collection('Form')
        .doc('formdata')
        .onSnapshot((doc) => {
          // console.log("Current data: ", doc.data());
          const firebaseData = doc.data()
          if (firebaseData) {
            this.name = firebaseData.name
            this.phone = firebaseData.phone
            this.address = firebaseData.address
            this.postcode = firebaseData.postcode
            this.date = firebaseData.date
            this.area = firebaseData.area
            this.sizebox = firebaseData.sizebox
            this.quantity = firebaseData.quantity
          }
        })
    },
    created() {
      this.getData()
    },
    addData() {
      // เก็บข้อมูล Form ใน collection MyForm ( มี 1 document แต่จะ update ข้อมูลเรื่อย ๆ )
      const data = {
        name: this.name,
        phone: this.phone,
        postcode: this.postcode,
        area: this.area,
        sizebox: this.sizebox,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }
      db.collection('MyForm')
        .doc()
        .set(data)
        .then(function () {
          console.log('Document successfully written! -> Form')
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })

      // เก็บข้อมูล Input Text ใน collection MyText (มีหลาย document ข้อมูลจะเพิ่มขึ้นเรื่อย ๆ )แสดงผลออกมาที่ด้านนนอก
      const dataText = {
        name: this.name,
        phone: this.phone,
        address: this.address,
        district: this.district,
        province: this.province,
        postcode: this.postcode,
        area: this.area,
        sizebox: this.sizebox,
        quantity: this.quantity,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }
      db.collection('Service')
        .doc()
        .set(dataText)
        .then(function () {
          console.log('Document successfully written! -> Service')
        })
    },
    Submit() {
      this.$refs.form.Submit()
    },
    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>

<style></style>
