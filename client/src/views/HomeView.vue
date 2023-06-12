<template>
  <main>
    Home
    <div><input type="" name="" placeholder="Category" v-model="topic" /></div>
    <button @click="fetchTopic()">fetchTopic</button>
    <div>Current Category - Nouns/Verbs/Pronouns</div>
    <div>Aviation</div>
    <div>{{ clue }}</div>
    <div class="flex flex-col mx-auto gap-1 mb-1">
      <div
        v-for="attempt in previousAttempts"
        class="mx-auto flex gap-1"
        ref="previousAttemptsDom"
      >
        <div
          v-for="char in attempt"
          class="w-[64px] h-[64px] text-[2rem] border font-mono text-center flex items-center justify-center"
        >
          {{ char }}
        </div>
      </div>
    </div>
    <div class="flex justify-center text-mono gap-1" v-if="!gameOver">
      <input
        type="text"
        maxlength="1"
        v-for="(char, index) of word"
        :key="index"
        v-model="userInput[index]"
        ref="inputBox"
        class="w-[64px] h-[64px] text-[2rem] border font-mono text-center"
        @input="nextField(index + 1)"
      />
    </div>
    <div class="flex pt-1 justify-center gap-1">
      <button
        @click="clearInput()"
        class="w-[64px] h-[64px] text-[2rem] border font-mono text-center bg-yellow-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 mx-auto"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button
        @click="submitInput"
        class="w-[64px] h-[64px] text-[2rem] border font-mono text-center bg-green-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 mx-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>

    <div>{{ previousAttempts.length + 1 }}/3 Attempts</div>
    <div><button class="bg-blue-300" @click="sumthin()">Do Sumthin</button></div>
    <div
      v-if="gameOver"
      class="flex flex-col bg-black/50 absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
    >
      <div class="flex flex-col bg-white p-4 justify-center items-center">
        <div>You</div>
        <div v-if="won" class="text-xl font-bold text-green-500">Won!</div>
        <div v-else class="text-xl font-bold text-green-500">Lost!</div>
        <div v-if="!won">The word was</div>
        <div v-if="!won" class="text-xl font-bold text-green-500">{{ word }}</div>
        <div>New Topic or New Word?</div>
        <form method="dialog" class="flex gap-2 mt-2">
          <button
            class="w-[128px] h-[64px] text-[2rem] border font-mono text-center flex items-center justify-center"
            @click="fetchTopic()"
          >
            Topic</button
          ><button
            class="w-[128px] h-[64px] text-[2rem] border font-mono text-center flex items-center justify-center"
            @click="newWord()"
          >
            Word
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { reactive, ref, onMounted, nextTick, watch } from "vue";

export default {
  setup() {
    const gameOver = ref(false);
    const won = ref(false);
    const gameoverModal = ref(null);
    const previousAttempts = reactive([]);
    const previousAttemptsDom = reactive([]);
    const test = ref(true);
    const word = ref("");
    const userInput = reactive([]);
    const inputBox = ref([]);
    const clue = ref("");
    const topic = ref("");

    const words = reactive([]);

    function newWord() {
      fetchWords();
      clearAttempts();
      nextTick(() => {
        clearInput();
      });
      // clearInput();
    }

    async function fetchTopic() {
      gameOver.value = false;
      await fetch("http://192.168.1.64:8081/api/topic", {
        method: "POST",
        body: JSON.stringify({ topic: topic.value }),
        headers: { "Content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          words.splice(0, words.length);

          let freshWords = JSON.parse(data);

          console.log(freshWords);

          freshWords.forEach((element) => {
            words.push(element);
          });

          console.log(words);
          let winner = freshWords[Math.floor(Math.random() * freshWords.length)];
          console.log(winner);
          word.value = winner.word;
          for (const letter in word.value) {
            userInput.push("");
          }
          clue.value = winner.clue;
        });
    }

    function fetchWords() {
      gameOver.value = false;
      let winner = words[Math.floor(Math.random() * words.length)];
      word.value = winner.word;
      for (const letter in word.value) {
        userInput.push("");
      }
      clue.value = winner.clue;
    }

    function nextField(x) {
      if (inputBox.value[x] == undefined) {
        submitInput();
        return;
      }
      nextTick(() => {
        inputBox.value[x].focus();
      });
    }

    function submitInput() {
      let submission = userInput.join("");
      previousAttempts.push(submission);
      nextTick(() => {
        wordColorizer();
      });

      clearInput();
    }

    function clearInput() {
      for (let i = 0; i < userInput.length; i++) {
        userInput[i] = "";
      }
      inputBox.value[0].focus();
    }

    function clearAttempts() {
      for (const key in previousAttempts + 1) {
        previousAttempts.pop();
      }
    }

    function wordColorizer() {
      // console.log(previousAttempts);
      let correct = 0;
      for (let i = 0; i < word.value.length; i++) {
        // console.log(previousAttempts.length);
        let a = previousAttemptsDom[previousAttempts.length - 1].children[
          i
        ].innerText.toLowerCase();
        let b = word.value[i].toLowerCase();
        console.log(a);
        console.log(word.value[i]);
        if (word.value.toLowerCase().includes(a) && a !== b) {
          previousAttemptsDom[previousAttempts.length - 1].children[i].classList.value +=
            " bg-yellow-300";
        }
        if (a == b) {
          previousAttemptsDom[previousAttempts.length - 1].children[i].classList.value +=
            " bg-green-300";
          correct++;
        }
      }
      if (correct == word.value.length) {
        console.log("winner");
        gameOver.value = true;
        won.value = true;
        return true;
        // winner = true
      }
    }

    function sumthin() {
      // newWord();
      // let thing = previousAttemptsDom[0].children[0];
      // console.log(thing);
      // gameoverModal.showModal();
      clearAttempts();
      // gameOver.value = true;
    }

    // const moveFocus = (currentIndex) => {
    //   if (currentIndex < userInput.length - 1 && userInput[currentIndex] !== "") {
    //     inputBox.value[currentIndex + 1].focus();
    //   }
    // };

    watch(previousAttempts, () => {
      if (previousAttempts.length === 3) {
        gameOver.value = true;
        won.value = false;
      }
    });

    // watch(
    //   userInput,
    //   () => {
    //     if (userInput.length === 0) {
    //       return;
    //     }

    //     // console.log(inputBox[2]);
    //     // inputBox[2].focus();d
    //     // console.log(userInput);

    //     // console.log(refs);
    //     // for (let i = 0; i < userInput.length; i++) {
    //     //   if (userInput[i].length === 0) {
    //     //     $refs.value[i].focus();
    //     //     break;
    //     //   }
    //     // }
    //   },
    //   { deep: true }
    // );

    onMounted(() => {
      // fetchWords();
    });

    return {
      test,
      words,
      won,
      word,
      userInput,
      previousAttempts,
      previousAttemptsDom,
      submitInput,
      nextField,
      inputBox,
      wordColorizer,
      sumthin,
      clue,
      clearInput,
      gameoverModal,
      gameOver,
      fetchWords,
      newWord,
      fetchTopic,
      topic,
    };
  },
};
</script>
