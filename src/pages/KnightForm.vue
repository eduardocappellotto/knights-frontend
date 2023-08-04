<template>
    <q-page>
        <q-page-container class="q-pa-md flex justify-center">
            <q-form @submit="submitNewKnight" class="space-y-4 text-black" style="width: 60%;min-width: 20rem}">
                <q-btn class="q-mb-lg" round color="primary" icon="arrow_back" @click="router.push('/')"></q-btn>

                <br>
                <label for="name">Name</label>
                <q-input required class="q-my-sm" :disable="isEdit" outlined dense v-model="knight.name"
                    placeholder="Gandalf the White" />
                <label for="name">Nickname</label>
                <q-input required class="q-my-sm" outlined dense v-model="knight.nickname" placeholder="Gandalf" />
                <label for="name">Birthday</label>
                <q-input required placeholder="Example: 2023/04/18" class="q-my-sm" :disable="isEdit" outlined dense
                    v-model="knight.birthday" mask="####-##-##">
                    <template v-slot:append>
                        <q-icon name=" event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="knight.birthday">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup placeholder="Close" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <span class="text-subtitle text-weight-bold" for="name">Weapons <small>(you can add more than one, but just
                        one active!)</small></span>
                <div v-for="(weapon, index) in knight.weapons" :key="index" class="space-y-2 q-my-lg">
                    <label for="Weapon Name">Weapon Name</label>
                    <q-input :disable="isEdit" required class="q-my-sm" outlined dense v-model="weapon.name"
                        placeholder="Blasting Wand" />
                    <label for="Weapon Name">Weapon Modificator (from -3 to +3)</label>
                    <q-input :disable="isEdit" required class="q-my-sm" outlined dense v-model="weapon.mod"
                        placeholder="Weapon Mod" type="number" />
                    <label for="Weapon Name">Weapon Attribute</label>
                    <q-select :disable="isEdit" required class="q-my-sm" outlined dense v-model="weapon.attr"
                        :options="Object.keys(knight.attributes)" placeholder="Weapon Attribute" />

                    <div class="flex justify-start align-center">
                        <q-radio :disable="isEdit" label="Is equipped" v-model="equippedWeaponIndex" :val="index" />

                    </div>
                    <q-btn :disable="isEdit" @click="addWeapon" label="Add Weapon" color="primary" />
                    <q-btn class="q-mx-md" :disable="isEdit" v-if="index > 0" @click="deleteWeapon(index)" label="Delete"
                        color="negative" />
                </div>

                <span class="text-subtitle text-weight-bold" for="name">Attributes </span>
                <br>

                <div v-for="(value, key) in knight.attributes" :key="key" class="q-my-md">
                    <label for="Weapon Name">{{ key }}</label>
                    <q-input :disable="isEdit" required class="q-my-sm" outlined dense v-model="knight.attributes[key]"
                        :placeholder="`${key}: 0 - 100`" type="number" min="0" max="100" />
                </div>
                <label for="Weapon Name"> Key Attribute</label>

                <q-select :disable="isEdit" required class="q-mb-lg" v-model="knight.keyAttribute"
                    :options="Object.keys(knight.attributes)" outlined dense placeholder="strength" />
                <q-btn v-if="!isEdit" type="submit" :label="isEdit ? 'Update' : 'Save'" color="primary" />
                <q-btn v-if="isEdit" label="Update" color="primary" @click="submitNewKnight" />
            </q-form>
        </q-page-container>
    </q-page>
</template>
  
<script setup lang="ts">
import { IKnight } from 'src/interfaces/knight.interface';
import { useKnightStore } from 'src/store';
import { ref, watch, onMounted, toRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const isEdit = ref(false)
const router = useRouter()
const route = useRoute()

const $q = useQuasar()

const attributesEnum = ref(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"])

const knight = ref<IKnight>({
    name: '',
    nickname: '',
    birthday: '',
    weapons: [
        {
            name: '',
            mod: 0,
            attr: '',
            equipped: true
        },
    ],
    attributes: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
    },
    keyAttribute: 'strength',
    deleted: false
});
let equippedWeaponIndex = ref(0);

const { createKnight, fetchKnightById, updateKnight } = useKnightStore();

onMounted(async () => {

    if (!!route.params.id) {
        let knightId = route.params.id
        isEdit.value = true;
        knight.value = await fetchKnightById(knightId)
    }
});

async function submitNewKnight() {

    try {
        if (isEdit.value) {

            await updateKnight(route.params?.id, knight.value)
            $q.notify({
                type: 'positive',
                message: 'Nickname updated successfully!'
            })
        } else {
            await createKnight({ ...knight.value, deleted: false })
            $q.notify({
                type: 'positive',
                message: 'Knight created successfully!'
            })
        }
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: 'Error creating the Knight!'
        })

    } finally {
        router.push("/")
    }


}

const addWeapon = () => {
    knight.value.weapons.push({
        name: '',
        mod: 0,
        attr: '',
        equipped: false,
    });
};

const deleteWeapon = (index: number) => {
    knight.value.weapons.splice(index, 1);
};

watch(equippedWeaponIndex, (newIndex) => {
    knight.value.weapons.forEach((weapon, index) => {
        weapon.equipped = index === newIndex;
    });
});

</script>
  