<script lang='ts' setup>
import { ref } from 'vue'
import { StorageAccessLevel } from '@aws-amplify/storage'
import { levelType, MyStorageItem, putStorage } from '../lib/Storage'
import FileList from './FileList.vue'
const storageListRef = ref<MyStorageItem[]>([])
levelType.map((level, idx) => { storageListRef.value.push({ level: level, idx: idx }) })
const fileRef = ref<File[]>([]),
  levelRef = ref<StorageAccessLevel>('public')
const uploadFiles = async () => {
  if (fileRef.value.length > 0) {
    await putStorage(
      fileRef.value[0].name, // ファイル名
      fileRef.value[0],
      { level: levelRef.value }
    )
    //ライフサイクルフック
    storageListRef.value.find(item => {
      if (item.level === levelRef.value) {
        item.idx += storageListRef.value.length
      }
    })
    //クリアする
    fileRef.value.length = 0
  }
}
</script>

<template>
  <v-container>
    <v-select v-model="levelRef" :items="levelType" label="level"></v-select>
    <v-file-input v-model="fileRef" label="File input" clearable></v-file-input>
    <v-btn color="primary" :disabled="fileRef.length === 0" @click="uploadFiles">upload</v-btn>
    <v-divider class="my-6"></v-divider>
    <file-list class="mt-4" v-for="item in storageListRef" :key="item.idx" :level="item.level"></file-list>
  </v-container>
</template>
