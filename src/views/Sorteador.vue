<template>
  <div class="kahoot-container">
    <h1 class="title">Sorteador de Bingo</h1>

    <div v-if="!roomCode" class="loading">
      <p>🔄 Carregando código da sala...</p>
    </div>

    <div v-else class="game">
      <h2 class="room-code">Sala: {{ roomCode }}</h2>

      <button @click="sortearNumero" :disabled="isDrawing" class="btn-draw">
        {{ isDrawing ? "Sorteando..." : "Sortear Número" }}
      </button>

      <div class="numeros">
        <span v-for="num in drawnNumbers" :key="num" class="numero">
          {{ num }}
        </span>
      </div>

      <h3 v-if="winner" class="winner">🏆 {{ winner }} venceu o bingo! 🏆</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
  setup() {
    const roomCode = ref<string | null>("3");
    const drawnNumbers = ref<number[]>([]);
    const winner = ref<string | null>(null);
    const isDrawing = ref<boolean>(false);
    let socket: WebSocket | null = null;

    const connectRoom = () => {
      if (!roomCode.value) return;

      socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomCode.value}`);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "new_number") {
          drawnNumbers.value.push(data.number);
        } else if (data.type === "winner") {
          winner.value = data.winner;
        }
      };

      socket.onerror = (error) => {
        console.error("Erro na conexão WebSocket:", error);
      };
    };

    const sortearNumero = async () => {
      if (!roomCode.value) return;
      isDrawing.value = true;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/draw_number/${roomCode.value}`,
          { method: "POST" }
        );
        const data = await response.json();
        if (data.new_number) drawnNumbers.value.push(data.new_number);
      } catch (error) {
        console.error("Erro ao sortear número:", error);
      }

      isDrawing.value = false;
    };

    onMounted(async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get_room_code");
        const data = await response.json();
        if (data.room_code) {
          roomCode.value = data.room_code;
          connectRoom();
        } else {
          console.error("Código da sala não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao obter código da sala:", error);
      }
    });

    return {
      roomCode,
      drawnNumbers,
      winner,
      isDrawing,
      sortearNumero,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");

.kahoot-container {
  font-family: "Fredoka One", cursive;
  background: linear-gradient(to right, #5a189a, #7209b7, #3a0ca3);
  color: #fff;
  text-align: center;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ffffff;
  text-shadow: 2px 2px #000;
}

.room-code {
  font-size: 1.8rem;
  background-color: #3f37c9;
  padding: 10px 30px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.btn-draw {
  font-size: 1.5rem;
  padding: 15px 40px;
  border: none;
  border-radius: 30px;
  background-color: #f72585;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.btn-draw:hover {
  background-color: #ff4d9d;
  transform: scale(1.05);
}

.btn-draw:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.numeros {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.numero {
  background-color: #fff;
  color: #3f37c9;
  font-size: 1.5rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

.winner {
  margin-top: 30px;
  font-size: 1.8rem;
  color: #4cc9f0;
  text-shadow: 1px 1px #000;
}

.loading {
  font-size: 1.4rem;
  background-color: #ffbe0b;
  color: #000;
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
