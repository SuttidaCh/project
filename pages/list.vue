<template>
  <v-container>
    <h1>ข้อมูลลูกค้า</h1>
    <br />
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table :headers="headers" :items="textList" :search="search">
        ></v-data-table
      >
    </v-card>
  </v-container>
</template>

<script>
import { db } from '~/plugins/firebaseConfig.js'
export default {
  data() {
    return {
      search: '',
      headers: [
        { text: 'ชื่อ-สกุล', value: 'name' },
        { text: 'ติดต่อ', value: 'phone' },
        { text: 'ที่อยู่', value: 'address' },
        { text: 'อำเภอ', value: 'district' },
        { text: 'จังหวัด', value: 'province' },
        { text: 'รหัสไปรษณีย์', value: 'postcode' },
      ],
      textList: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      db.collection('Service')
        .orderBy('timestamp')
        .onSnapshot((querySnapshot) => {
          const data = []
          querySnapshot.forEach((doc) => {
            data.push(doc.data())
          })
          this.textList = data
        })
    },
  },
}
</script>

<style></style>
