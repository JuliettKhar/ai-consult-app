<script setup lang="ts">
import HeadAIIMG from '@/assets/image/head-ai.png?url'
import { nextTick, onMounted, ref, type VNodeRef } from 'vue'

const canvas = ref<VNodeRef | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const img = ref(new Image())
const lines = [
  { x1: 450, y1: 180, x2: 500, y2: 150, progress: 0, direction: 1 },
  { x1: 400, y1: 250, x2: 480, y2: 230, progress: 0, direction: 1 },
  { x1: 380, y1: 320, x2: 460, y2: 340, progress: 0, direction: 1 },
  { x1: 420, y1: 400, x2: 490, y2: 420, progress: 0, direction: 1 },
  { x1: 450, y1: 180, x2: 520, y2: 120, progress: 0, direction: 1 },
  { x1: 470, y1: 250, x2: 530, y2: 200, progress: 0, direction: 1 },
  { x1: 520, y1: 320, x2: 580, y2: 340, progress: 0, direction: 1 },
  { x1: 570, y1: 400, x2: 600, y2: 420, progress: 0, direction: 1 },
]
const glowPoints = [
  { x: 180, y: 140 },
  { x: 380, y: 90 },
  { x: 280, y: 280 },
  { x: 480, y: 380 },
  { x: 130, y: 340 },
  { x: 230, y: 190 },
  { x: 330, y: 240 },
  { x: 430, y: 290 },
  { x: 530, y: 340 },
  { x: 580, y: 140 },
  { x: 160, y: 250 },
  { x: 300, y: 180 },
  { x: 400, y: 220 },
]
const pulse = ref(0)
const direction = ref(1)

const backgroundParticles = Array.from({ length: 70 }, () => ({
  x: Math.random() * 600,
  y: Math.random() * 600,
  radius: 2 + Math.random() * 2,
  dx: (Math.random() - 0.5) * 0.5,
  dy: (Math.random() - 0.5) * 0.5,
  alpha: Math.random() * 0.5 + 0.2,
}))

const drawBackgroundParticles = () => {
  const width = (canvas.value as HTMLCanvasElement).width
  const height = (canvas.value as HTMLCanvasElement).height

  backgroundParticles.forEach((p) => {
    p.x += p.dx
    p.y += p.dy

    if (p.x < 0 || p.x > width) p.dx *= -1
    if (p.y < 0 || p.y > height) p.dy *= -1

    ctx.value!.beginPath()
    ctx.value!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)

    // светящийся эффект
    ctx.value!.shadowBlur = 12
    ctx.value!.shadowColor = 'rgba(180, 100, 255, 0.4)'

    ctx.value!.fillStyle = `rgba(180, 100, 255, ${p.alpha})`
    ctx.value!.fill()
    ctx.value!.shadowBlur = 0
  })
}

const animate = () => {
  if (ctx.value && canvas.value) {
    ctx.value.clearRect(0, 0, canvas.value.width || 0, canvas.value.height || 0)
    ctx.value.globalAlpha = 1
    ctx.value.globalAlpha = 0.92
    ctx.value.drawImage(img.value, 0, 0, canvas.value.width || 0, canvas.value.height || 0)
    ctx.value.globalAlpha = 1

    ctx.value.lineWidth = 2
    ctx.value.strokeStyle = 'rgba(0, 200, 255, 0.6)'
    lines.forEach((line) => {
      const { x1, y1, x2, y2, progress } = line
      const currentX = x1 + (x2 - x1) * progress
      const currentY = y1 + (y2 - y1) * progress

      ctx.value!.beginPath()
      ctx.value!.moveTo(x1, y1)
      ctx.value!.lineTo(currentX, currentY)
      ctx.value!.stroke()

      // Update progress with direction
      line.progress += 0.01 * line.direction
      if (line.progress >= 1) {
        line.progress = 1
        line.direction = -1
      } else if (line.progress <= 0) {
        line.progress = 0
        line.direction = 1
      }
    })

    drawBackgroundParticles()
    // Animate glow points
    glowPoints.forEach((point) => {
      ctx.value!.beginPath()
      const radius = 5 + pulse.value
      ctx.value!.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.value!.shadowBlur = 10 + pulse.value * 2
      ctx.value!.shadowColor = 'rgba(0, 200, 255, 0.8)'
      ctx.value!.fillStyle = 'rgba(0, 200, 255, 0.6)'
      ctx.value!.fill()
      ctx.value!.shadowBlur = 0 // reset after drawing
    })

    // Pulse control (oscillate between 0 and 3)
    pulse.value += direction.value * 0.1
    if (pulse.value > 3) direction.value = -1
    if (pulse.value < 0) direction.value = 1

    requestAnimationFrame(animate)
  }
}

onMounted(async () => {
  await nextTick()
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    img.value.src = HeadAIIMG
    img.value.onload = () => animate()
  }
})
</script>

<template>
  <canvas ref="canvas" width="600" height="600"></canvas>
</template>

<style scoped lang="scss"></style>
