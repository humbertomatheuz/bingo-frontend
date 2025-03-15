<template>
  <div class="container">
    <h1>Cartela de Bingo</h1>

    <div v-if="!roomCode">
      <input v-model="inputRoomCode" placeholder="Código da sala" />
      <input v-model="userName" placeholder="Seu nome" />
      <button @click="joinGame">Entrar</button>
    </div>

    <div v-else>
      <h2>Sala: {{ roomCode }}</h2>
      <h3>Jogador: {{ userName }}</h3>

      <div class="cartela">
        <div 
          v-for="num in cartela" 
          :key="num" 
          @click="marcarNumero(num)"
          :class="{ marcado: marcados.includes(num) }"
        >
          {{ num }}
        </div>
      </div>

      <h3 v-if="winner">🏆 {{ winner }} venceu o bingo! 🏆</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const inputRoomCode = ref<string>("");
    const userName = ref<string>("");
    const roomCode = ref<string | null>(null);
    const cartela = ref<number[]>([]);
    const marcados = ref<number[]>([]);
    const winner = ref<string | null>(null);
    
    const joinGame = async () => {
      const response = await fetch("http://127.0.0.1:8000/join_game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName.value, room_code: inputRoomCode.value }),
      });

      const data = await response.json();
      if (data.cartela) {
        cartela.value = data.cartela;
        roomCode.value = inputRoomCode.value;
      }
    };

    const marcarNumero = async (num: number) => {
      if (marcados.value.includes(num)) return;
      marcados.value.push(num);

      await fetch("http://127.0.0.1:8000/mark_number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName.value, room_code: roomCode.value, number: num }),
      });
    };

    return {
      inputRoomCode,
      userName,
      roomCode,
      cartela,
      marcados,
      winner,
      joinGame,
      marcarNumero
    };
  },
};
</script>

<style scoped>
.container {
  background-color: #2c003e;
  color: white;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  margin: auto;
  margin-top: 50px;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
}
.cartela {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.cartela div {
  background-color: white;
  color: #2c003e;
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
.marcado {
  background-color: #bb86fc;
  color: white;
}
</style>
