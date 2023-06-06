<template>
  <main>
    Home
    <div><input type="" name="" value="" placeholder="Category" /></div>
    <div>Current Category</div>
    <div>Aviation</div>
    <div class="flex flex-col mx-auto bg-red-100">
      <div v-for="attempt in previousAttempts" class="mx-auto flex gap-1">
        <div
          v-for="char in attempt"
          class="w-[64px] h-[64px] text-[2rem] border font-mono text-center"
        >
          {{ char }}
        </div>
        <!-- {{ attempt }} -->
      </div>
    </div>
    <div class="flex justify-center text-mono gap-1">
      <input
        type="text"
        maxlength="1"
        v-for="(char, index) of word"
        :key="index"
        v-model="userInput[index]"
        :ref="'input' + index"
        class="w-[64px] h-[64px] text-[2rem] border font-mono text-center"
        @input="moveFocus(index)"
      />
    </div>
    <button @click="submitInput">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
    <div></div>
  </main>
</template>

<script>
import { reactive, ref, onMounted, nextTick, watch } from "vue";

export default {
  setup() {
    const inputRefs = ref([]);
    const tries = ref(4);
    const previousAttempts = reactive([]);
    const test = ref(true);
    const word = ref("");
    const userInput = reactive([]);
    const words = reactive([
      "Airspeed",
      "Avionic",
      "Landing",
      "Airfoil",
      "Elevate",
      "Rudder",
      "Flaps",
      "Stalled",
      "Trimmed",
      "Control",
      "Pitched",
      "Landing",
      "Gliders",
      "Spoiler",
      "Stallar",
      "Runways",
      "Aircraft",
      "Canards",
      "Flights",
      "Balloon",
    ]);
    function fetchWords() {
      word.value = words[Math.floor(Math.random() * words.length)];
      for (const letter in word.value) {
        userInput.push("");
      }
    }

    function nextField(x) {
      console.log(x);
    }

    function submitInput() {
      let submission = userInput.join("");
      console.log(submission);
      previousAttempts.push(submission);
    }

    const moveFocus = (currentIndex) => {
      if (currentIndex < userInput.length - 1 && userInput[currentIndex] !== "") {
        inputRefs.value[currentIndex + 1].focus();
      }
    };

    watch(
      userInput,
      () => {
        for (let i = 0; i < userInput.length; i++) {
          if (userInput[i].length === 0) {
            $refs.value[i].focus();
            break;
          }
        }
      },
      { deep: true }
    );

    onMounted(() => {
      fetchWords();
    });

    return {
      test,
      words,
      word,
      userInput,
      previousAttempts,
      submitInput,
      nextField,
      moveFocus,
    };
  },
};
</script>
