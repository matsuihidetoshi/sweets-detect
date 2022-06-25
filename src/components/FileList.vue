<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import { getStorage, downloadFile } from '../lib/Storage'
import { StorageAccessLevel, S3ProviderListOutputItem } from '@aws-amplify/storage'
import dayjs from 'dayjs'
import axios from 'axios'
const props = defineProps<{
  level: StorageAccessLevel
}>()
const { level } = toRefs(props)
const filesRef = ref<S3ProviderListOutputItem[]>([])
const getS = async () => {
  const f = await getStorage(level.value)
  if (f.length > 0) {
    filesRef.value.push(...f)
  }
}
const download = async (f: S3ProviderListOutputItem) => {
  downloadFile(f.key as string, level.value)
}
const result = ref("");
const detect = async (path: string, file: string) => {
  await axios.post(
    'https://unpcd4q17d.execute-api.ap-northeast-1.amazonaws.com/default/detectSweets',
    {
      path,
      file
    }
  ).then((r) => {
    console.log(r.data.body.match(/Dessert/g))
    if (r.data.body.match(/Dessert/g)) {
      result.value = "Sweet!!"
    } else {
      result.value = "No!!"
    }
    console.log(result)
  })
}
getS()
</script>
<template>
  <div v-if="filesRef.length > 0">
    <p>{{ level }}</p>
    <ul>
      <li v-for="(f, n) in filesRef" :key="n">
        <v-btn variant="text" @click="download(f)">
          {{
            `${f.key} (${dayjs(f.lastModified).format("YYYY-MM-DD HH:mm:ss")})`
          }}
        </v-btn>
        <v-btn @click="detect(level, f.key)">
          detect
        </v-btn>
        <p>result: {{ result }}</p>
      </li>
    </ul>
  </div>
</template>
