<template>
  <div class="container">
    <h1>Sorteador de Bingo</h1>

    <div v-if="!roomCode">
      <input v-model="inputRoomCode" placeholder="Digite o código da sala" />
      <button @click="connectRoom">Entrar</button>
    </div>

    <div v-else>
      <h2>Sala: {{ roomCode }}</h2>

      <button @click="sortearNumero" :disabled="isDrawing">
        {{ isDrawing ? "Sorteando..." : "Sortear Número" }}
      </button>

      <div class="numeros">
        <span v-for="num in drawnNumbers" :key="num" class="numero">
          {{ num }}
        </span>
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
    const roomCode = ref<string | null>(null);
    const drawnNumbers = ref<number[]>([]);
    const winner = ref<string | null>(null);
    const isDrawing = ref<boolean>(false);

    let socket: WebSocket | null = null;

    const connectRoom = () => {
      if (!inputRoomCode.value) return;

      roomCode.value = inputRoomCode.value;
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

    return {
      inputRoomCode,
      roomCode,
      drawnNumbers,
      winner,
      isDrawing,
      connectRoom,
      sortearNumero,
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

h1, h2, h3 {
  color: #bb86fc;
}

button {
  background-color: #bb86fc;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}

button:disabled {
  background-color: gray;
}

.numeros {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.numero {
  background-color: white;
  color: #2c003e;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  width: 40px;
  text-align: center;
}
</style>
