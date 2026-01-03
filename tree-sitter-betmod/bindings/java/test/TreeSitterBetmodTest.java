import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.betmod.TreeSitterBetmod;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterBetmodTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterBetmod.language()));
    }
}
