from uagents import Agent, Context

# instantiate agent
agent = Agent(
    name="bob",
    seed="secret_seed_phrase_bob_67890",
    port=8001,
    endpoint=["http://localhost:8001/submit"]
)

# startup handler
@agent.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {agent.name} and my address is {agent.address}.")

if __name__ == "__main__":
    agent.run()
