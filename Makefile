DEPS = ./public/src/cpp/processor-perf.cpp

OUTPUT_JS = ./public/src/js/worklet/CompiledProcessorModule.js

CC = emcc

EM_ES6_PATH = ./public/lib/em-es6-module.js

FLAGS = -s WASM=1 \
    -s EXPORTED_FUNCTIONS=_bite,_processPerf \
    -o $(OUTPUT_JS) $(DEPS) \

build: $(DEPS)
	@$(CC) $(FLAGS)

clean:
	@rm -rf $(OUTPUT_JS)
