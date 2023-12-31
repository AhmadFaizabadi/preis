<template>
  <q-list bordered class="scroll q-pt-lg" dense>
    <q-item>
      <q-item-section class="bg-cyan text-center">
        <q-item-label overline class="text-bold">USER STATS</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator spaced />
    <q-inner-loading :showing="loading" label="Please wait..." label-class="text-teal" label-style="font-size: 1.1em" />
    <template v-for="item in items" :key="item.key">
      <q-item>
        <q-item-section avatar>
          <q-avatar square size="32px"><img :src="item.img"></q-avatar>
          <q-item-label caption lines="2">{{ item.label
          }}</q-item-label>

        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right">{{ item.value }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
    </template>
  </q-list>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios';

const items = ref([])

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  const statItems = [{ label: 'Number of Campaigns', img: 'icons/campaign.png', key: 'numberOfCampaigns' },
  { label: 'Wildcat Usage', img: 'icons/wildcat.png', key: 'wildcatUsageCount' },
  { label: 'Number of Contact Lists', img: 'icons/contact-lists.png', key: 'contactListCount' },
  { label: 'Total Number of Contacts', img: 'icons/contacts.png', key: 'totalContactsCount' },
  { label: 'Click-Through Rate (CTR)', img: 'icons/ctr.png', key: 'clickThroughRate' },
  { label: 'Bounce Rate', img: 'icons/bounce-rate.png', key: 'bounceRate' },
  { label: 'Unsubscribe Rate', img: 'icons/unsubscribe.png', key: 'unsubscribeRate' },
  ]
  try {
    const userstat = await api.get(`api/user/stat2/${props.userId}`)
    const stats = []
    for (let item of Object.entries(userstat.data)) {
      const f = statItems.find(w => w.key === item[0])
      if (f != null)
        stats.push({ ...f, value: item[1] })
    }
    items.value = stats
  }
  finally {
    loading.value = false
  }
})
</script>
