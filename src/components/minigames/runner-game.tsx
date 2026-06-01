"use client";

import { useEffect, useRef, useState } from "react";
import { Coins, Play, RotateCcw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface RunnerResult {
  coins: number;
  tokens: number;
  distance: number;
}

type Phase = "ready" | "playing" | "over";

/**
 * Lazy-loaded Phaser endless runner. Phaser is only imported once this
 * component mounts (its own route), keeping it out of the main bundle.
 * The player auto-runs; tap / space to jump, collect gold coins and blue
 * investment tokens, and avoid the red bills. Hitting one ends the run.
 */
export function RunnerGame({ onFinish }: { onFinish?: (r: RunnerResult) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [coins, setCoins] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [result, setResult] = useState<RunnerResult | null>(null);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (phase !== "playing") return;
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let game: any = null;

    void (async () => {
      const Phaser = (await import("phaser")).default;
      if (destroyed || !container) return;

      const width = container.clientWidth || 360;
      const height = 360;
      const GROUND = height - 44;

      class RunnerScene extends Phaser.Scene {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        player!: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items!: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obstacles!: any;
        speed = 240;
        elapsed = 0;
        spawnAt = 0;
        coinCount = 0;
        tokenCount = 0;
        ended = false;

        create() {
          this.add.rectangle(width / 2, GROUND + 22, width, 44, 0x002a5c).setAlpha(0.12);

          this.player = this.add.rectangle(60, GROUND - 18, 30, 36, 0x0067b1);
          this.physics.add.existing(this.player);
          this.player.body.setCollideWorldBounds(true);
          this.player.body.setGravityY(1400);

          this.items = this.physics.add.group();
          this.obstacles = this.physics.add.group();

          const jump = () => {
            if (this.ended) return;
            if (this.player.body.blocked.down || this.player.body.touching.down) {
              this.player.body.setVelocityY(-620);
            }
          };
          this.input.on("pointerdown", jump);
          this.input.keyboard?.on("keydown-SPACE", jump);

          this.physics.add.overlap(this.player, this.items, (_p, item) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const it = item as any;
            if (it.getData("kind") === "token") {
              this.tokenCount += 1;
              setTokens(this.tokenCount);
            } else {
              this.coinCount += 1;
              setCoins(this.coinCount);
            }
            it.destroy();
          });

          this.physics.add.overlap(this.player, this.obstacles, () => this.end());
        }

        spawn() {
          const roll = Math.random();
          if (roll < 0.4) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ob: any = this.add.rectangle(width + 20, GROUND - 16, 26, 32, 0xff6b5e);
            this.obstacles.add(ob);
            ob.body.setAllowGravity(false);
            ob.body.setVelocityX(-this.speed);
          } else {
            const isToken = roll > 0.78;
            const y = GROUND - (Math.random() > 0.5 ? 90 : 40);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item: any = this.add.circle(
              width + 20,
              y,
              11,
              isToken ? 0x00b5c2 : 0xf2b600,
            );
            this.items.add(item);
            item.body.setAllowGravity(false);
            item.body.setVelocityX(-this.speed);
            item.setData("kind", isToken ? "token" : "coin");
          }
        }

        end() {
          if (this.ended) return;
          this.ended = true;
          const res: RunnerResult = {
            coins: this.coinCount,
            tokens: this.tokenCount,
            distance: Math.round(this.elapsed / 100),
          };
          setResult(res);
          setPhase("over");
          onFinish?.(res);
        }

        update(_t: number, delta: number) {
          if (this.ended) return;
          this.elapsed += delta;
          this.speed = 240 + Math.min(220, this.elapsed / 60);
          this.spawnAt -= delta;
          if (this.spawnAt <= 0) {
            this.spawn();
            this.spawnAt = Math.max(620, 1100 - this.elapsed / 40);
          }
          // Recycle off-screen bodies.
          for (const g of [this.items, this.obstacles]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            g.getChildren().forEach((c: any) => {
              if (c.x < -40) c.destroy();
              else if (c.body) c.body.setVelocityX(-this.speed);
            });
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: container,
        width,
        height,
        transparent: true,
        physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } },
        scene: RunnerScene,
      });
    })();

    return () => {
      destroyed = true;
      if (game) game.destroy(true);
    };
  }, [phase, runId, onFinish]);

  const start = () => {
    setCoins(0);
    setTokens(0);
    setResult(null);
    setRunId((n) => n + 1);
    setPhase("playing");
  };

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-navy text-lg font-extrabold">Coin Runner</h2>
        <div className="flex items-center gap-3 text-sm font-bold">
          <span className="text-gold inline-flex items-center gap-1">
            <Coins className="h-4 w-4" />
            {coins}
          </span>
          <span className="text-teal inline-flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {tokens}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="border-border from-brand/5 to-teal/10 relative w-full overflow-hidden rounded-xl border bg-gradient-to-b"
        style={{ height: 360 }}
      >
        {phase === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-muted text-sm">
              Tap or press space to jump. Collect{" "}
              <span className="text-gold font-semibold">coins</span> and{" "}
              <span className="text-teal font-semibold">investment tokens</span>, dodge
              the red bills.
            </p>
            <Button onClick={start}>
              <Play className="h-4 w-4" /> Start
            </Button>
          </div>
        )}
        {phase === "over" && result && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 p-6 text-center backdrop-blur-sm">
            <h3 className="text-navy text-xl font-extrabold">Run over!</h3>
            <p className="text-navy text-sm">
              {result.coins} coins · {result.tokens} tokens · {result.distance}m
            </p>
            <Button onClick={start} className="mt-1">
              <RotateCcw className="h-4 w-4" /> Run again
            </Button>
          </div>
        )}
      </div>
      <p className="text-muted text-center text-xs">
        Coins are everyday cash; tokens are long-term investments — both add up.
      </p>
    </Card>
  );
}
