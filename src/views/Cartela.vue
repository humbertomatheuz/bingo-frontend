<template>
  <div class="kahoot-container">
    <h1 class="title">🎉 Cartela de Bingo</h1>

    <div v-if="!roomCode" class="form">
      <input v-model="inputRoomCode" placeholder="Código da sala" class="input" />
      <input v-model="userName" placeholder="Seu nome" class="input" />
      <button @click="joinGame" class="btn">Entrar</button>
    </div>

    <div v-else class="game">
      <h2 class="room-code">Sala: {{ roomCode }}</h2>
      <h3 class="player">Jogador: {{ userName }}</h3>

      <div class="cartela">
        <div 
          v-for="(num, i) in cartela" 
          :key="i" 
          @click="marcarNumero(num)"
          :class="{ marcado: marcados.includes(num), celula: true }"
        >
          {{ num }}
        </div>
      </div>

      <h3 v-if="winner" class="winner">
        🏆 {{ winner }} venceu o bingo! 🏆
      </h3>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const inputRoomCode = ref<string>("");
    const userName = ref<string>("");
    const roomCode = ref<string | null>('3');
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
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

.kahoot-container {
  font-family: 'Fredoka One', cursive;
  background: linear-gradient(135deg, #3a0ca3, #7209b7, #f72585);
  color: white;
  min-height: 100vh;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 3rem;
  text-shadow: 2px 2px #000;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 90%;
  max-width: 400px;
}

.input {
  padding: 15px;
  border-radius: 20px;
  border: none;
  font-size: 1.2rem;
  text-align: center;
  outline: none;
}

.btn {
  background-color: #f72585;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn:hover {
  background-color: #ff4da6;
  transform: scale(1.05);
}

.room-code,
.player {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px 30px;
  border-radius: 20px;
  margin: 10px 0;
  font-size: 1.5rem;
}

.cartela {
  display: grid;
  grid-template-columns: repeat(5, 60px);
  grid-template-rows: repeat(5, 60px);
  gap: 10px;
  margin: 30px auto;
  justify-content: center;
}

.celula {
  background-color: white;
  color: #3a0ca3;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
}

.celula:hover {
  transform: scale(1.1);
}

.marcado {
  background-color: #7209b7;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 0 10px #f72585;
}

.winner {
  margin-top: 20px;
  font-size: 1.8rem;
  color: #4cc9f0;
  text-shadow: 1px 1px #000;
}
</style>
