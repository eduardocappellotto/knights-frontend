<template>
  <q-page class="row items-center justify-evenly column mt-10">
    <div class=" q-pa-md">


      <q-table :loading="loading" flat bordered title="Knights & Heroes" :rows="knightsList" :columns="columns"
        row-key="name">
        <template v-slot:top>

          <q-radio v-model="filter" val="" label="Knights" />
          <q-radio v-model="filter" val="heroes" label="Heroes" />
          <q-btn color="primary" class="q-mx-lg" :disable="loading" label="Add Knight" @click="router.push('/knight')" />
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn color="primary" icon-right="edit" no-caps flat dense
              @click="router.push(`/knight/${props.row._id}`)" />
            <q-btn color="negative" icon-right="delete" no-caps flat dense @click="confirmDeleteKnight(props.row._id)" />

          </q-td>
        </template>
      </q-table>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useKnightStore } from 'src/store/index';
import { IKnight, IWeapon } from 'src/interfaces/knight.interface';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

interface AttFunctions {
  attack: number;
  experience: number;
  [key: string]: number;
}

const { fetchKnights, deleteKnight } = useKnightStore();

const filter = ref('')
const router = useRouter()
const $q = useQuasar()

watch(filter, async (newFilter) => {
  await fetchKnights(newFilter);
});

onMounted(async () => {
  await fetchKnights(filter);
});

let store = useKnightStore()
const { error, loading, knightsList } = storeToRefs(store)

const confirmDeleteKnight = async (id: string) => {
  $q.dialog({
    title: 'Confirm Action',
    message: 'Confirm the execution of the knight? He will become a hero',
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteKnightAndNotify(id);
  }).onCancel(() => {
    return
  })

}

const deleteKnightAndNotify = async (id: string) => {
  try {
    await deleteKnight(id);

    $q.notify({
      type: 'positive',
      message: 'Knight killed with success! Now its a Hero!'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error killing the hero! Its still alive!'
    })
  } finally {
    await fetchKnights();
  }

}

const calculateAge = (birthDateString: string): number | string | null => {

  const today = new Date();
  const birthDate = new Date(birthDateString);

  if (isNaN(birthDate.getTime())) { // check if date is valid
    return '-';
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const calculateAttribute = (attName: string, knight: IKnight): number => {

  const attFunctions: AttFunctions = {
    'attack': calculateAttack(knight),
    'experience': calculateExperience(knight),

  }

  if ((Object.keys(attFunctions)).includes(attName)) {
    return attFunctions[attName]
  }
  return 0
};


const calculateAttack = (knight: IKnight): number => {

  const keyAttributeValue = knight.attributes[knight.keyAttribute];
  const equippedWeapon: IWeapon = knight.weapons.filter(weapon => weapon.equipped)[0]
  return 10 + calculateMod(keyAttributeValue) + equippedWeapon.mod

}
const calculateExperience = (knight: IKnight): number => {
  let age = calculateAge(knight.birthday) || 0

  if (typeof age === `number`) {
    return Math.floor((age - 7) * Math.pow(22, 1.45))
  }

  return 0
}

const calculateMod = (value: number): number => {
  if (value <= 8) return -2;
  if (value <= 10) return -1;
  if (value <= 12) return 0;
  if (value <= 15) return 1;
  if (value <= 18) return 2;
  return 3;
};


const columns = ref([
  {
    name: 'name',
    field: 'name',
    required: true,
    label: 'Nome',
    classes: 'table-field',
    style: 'padding: 1rem 2rem; font-size: 1rem; font-weight: 300',
    align: 'center',
  },
  { style: 'padding: 1rem 2rem; font-size: 1rem', name: 'calories', align: 'center', label: 'Idade', field: 'birthday', format: (val: string) => calculateAge(val) },
  { style: 'padding: 1rem 2rem; font-size: 1rem; font-weight: 300', align: 'center', name: 'fat', label: 'Armas', field: 'weapons', format: (val: object[]) => val.length },
  { style: 'padding: 1rem 2rem; font-size: 1rem; font-weight: 300', align: 'center', name: 'carbs', label: 'Atributo', field: 'keyAttribute', format: (val: string) => val.charAt(0).toUpperCase() + val.slice(1) },
  { style: 'padding: 1rem 2rem; font-size: 1rem; font-weight: 300', align: 'center', name: 'protein', label: 'Ataque', field: (row: IKnight) => row, format: (val: IKnight) => `${calculateAttribute('attack', val)}` },
  { style: 'padding: 1rem 2rem; font-size: 1rem; font-weight: 300', align: 'center', name: 'sodium', label: 'Exp', field: (row: IKnight) => row, format: (val: IKnight) => `${calculateAttribute('experience', val)}` },
  { style: 'padding: 1rem 2rem; font-size: 1rem', name: 'calories', align: 'center', label: 'Actions', field: 'birthday', format: (val: string) => calculateAge(val) },
  { style: 'padding: 1rem 2rem; font-size: 1rem', name: 'action', align: 'center', label: 'Action', field: 'action' }
]);

</script>

